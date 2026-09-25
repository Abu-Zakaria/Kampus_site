<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class BlogSanitizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::firstOrCreate(['name' => 'manage-blogs', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo('manage-blogs');

        $this->admin = User::factory()->create([
            'email' => 'blogadmin@test.com',
        ]);
        $this->admin->assignRole('Super Admin');
    }

    public function test_blog_creation_sanitizes_xss_vectors_and_strips_excerpt_html(): void
    {
        $dirtyContent = '<p class="ql-align-center">Safe text <strong>bold</strong></p><script>alert("xss")</script><a href="javascript:alert(1)" onclick="steal()">Click</a>';
        $dirtyExcerpt = '<b>Dirty</b> <script>bad()</script>Excerpt';

        $response = $this->actingAs($this->admin)->post('/admin/blog', [
            'title' => 'Secure Blog Post',
            'slug' => 'secure-blog-post',
            'category' => 'Technology',
            'excerpt' => $dirtyExcerpt,
            'content' => $dirtyContent,
            'is_published' => true,
        ]);

        $response->assertRedirect('/admin/blog');

        $blog = Blog::where('slug', 'secure-blog-post')->first();
        $this->assertNotNull($blog);

        // Content assertions
        $this->assertStringNotContainsString('<script>', $blog->content);
        $this->assertStringNotContainsString('alert("xss")', $blog->content);
        $this->assertStringNotContainsString('onclick', $blog->content);
        $this->assertStringNotContainsString('javascript:', $blog->content);
        $this->assertStringContainsString('Safe text', $blog->content);
        $this->assertStringContainsString('<strong>bold</strong>', $blog->content);

        // Excerpt assertions
        $this->assertStringNotContainsString('<b>', $blog->excerpt);
        $this->assertStringNotContainsString('<script>', $blog->excerpt);
        $this->assertEquals('Dirty bad()Excerpt', $blog->excerpt);
    }

    public function test_blog_update_sanitizes_xss_content(): void
    {
        $blog = Blog::create([
            'title' => 'Original Post',
            'slug' => 'original-post',
            'category' => 'Education',
            'content' => '<p>Original content</p>',
            'excerpt' => 'Original excerpt',
            'is_published' => true,
        ]);

        $dirtyContent = '<p>Updated paragraph</p><iframe src="https://evil.com"></iframe><img src="/storage/test.png" onerror="alert(1)" alt="Image">';

        $response = $this->actingAs($this->admin)->put("/admin/blog/{$blog->id}", [
            'title' => 'Updated Post',
            'slug' => 'original-post',
            'category' => 'Education',
            'content' => $dirtyContent,
            'excerpt' => 'Updated safe excerpt',
            'is_published' => true,
        ]);

        $response->assertRedirect('/admin/blog');

        $blog->refresh();
        $this->assertStringNotContainsString('<iframe', $blog->content);
        $this->assertStringNotContainsString('onerror', $blog->content);
        $this->assertStringContainsString('/storage/test.png', $blog->content);
        $this->assertStringContainsString('Updated paragraph', $blog->content);
    }

    public function test_artisan_sanitize_command_cleans_dirty_database_records(): void
    {
        // Insert a dirty row directly bypassing controller
        $dirtyBlog = Blog::create([
            'title' => 'Direct DB Blog',
            'slug' => 'direct-db-blog',
            'category' => 'Database',
            'content' => '<p>Direct insert</p><script>alert("database-xss")</script><a href="javascript:void(0)">Link</a>',
            'excerpt' => '<b>Bold</b> excerpt',
            'is_published' => true,
        ]);

        Artisan::call('blogs:sanitize');

        $dirtyBlog->refresh();
        $this->assertStringNotContainsString('<script>', $dirtyBlog->content);
        $this->assertStringNotContainsString('javascript:', $dirtyBlog->content);
        $this->assertStringNotContainsString('<b>', $dirtyBlog->excerpt);
        $this->assertStringContainsString('Direct insert', $dirtyBlog->content);
    }
}
