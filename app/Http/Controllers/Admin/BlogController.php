<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of all blog posts.
     */
    public function index()
    {
        $blogs = Blog::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * Show the form for creating a new blog post.
     */
    public function create()
    {
        $categories = Blog::distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category')
            ->values()
            ->all();

        return Inertia::render('Admin/Blogs/Form', [
            'blog' => null,
            'existingCategories' => $categories,
        ]);
    }

    /**
     * Store a newly created blog post in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs,slug',
            'category' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'image' => 'nullable|image|max:5120',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'tags' => 'nullable|string|max:1000',
            'meta_keywords' => 'nullable|string|max:1000',
            'is_published' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');

        if (!empty($validated['tags']) && empty($validated['meta_keywords'])) {
            $validated['meta_keywords'] = $validated['tags'];
        } elseif (!empty($validated['meta_keywords']) && empty($validated['tags'])) {
            $validated['tags'] = $validated['meta_keywords'];
        }

        // Handle image file upload
        if ($request->hasFile('image')) {
            $validated['image'] = '/storage/' . $request->file('image')->store('blogs', 'public');
        }

        unset($validated['image_tmp']);

        Blog::create($validated);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit($id)
    {
        $blog = Blog::findOrFail($id);
        $categories = Blog::distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category')
            ->values()
            ->all();

        return Inertia::render('Admin/Blogs/Form', [
            'blog' => $blog,
            'existingCategories' => $categories,
        ]);
    }

    /**
     * Update the specified blog post in storage.
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs,slug,' . $blog->id,
            'category' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'image' => 'nullable|image|max:5120',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'tags' => 'nullable|string|max:1000',
            'meta_keywords' => 'nullable|string|max:1000',
            'is_published' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');

        if (!empty($validated['tags']) && empty($validated['meta_keywords'])) {
            $validated['meta_keywords'] = $validated['tags'];
        } elseif (!empty($validated['meta_keywords']) && empty($validated['tags'])) {
            $validated['tags'] = $validated['meta_keywords'];
        }

        // Handle image file upload
        if ($request->hasFile('image')) {
            // Remove old uploaded file if it exists in local storage
            if ($blog->image && str_contains($blog->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $blog->image);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['image'] = '/storage/' . $request->file('image')->store('blogs', 'public');
        }

        $blog->update($validated);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post updated successfully.');
    }

    /**
     * Toggle featured status for the specified blog post.
     */
    public function toggleFeatured(Blog $blog)
    {
        $blog->update(['is_featured' => !$blog->is_featured]);
        return back()->with('success', 'Featured status updated.');
    }

    /**
     * Remove the specified blog post from storage.
     */
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        // Remove storage image if present
        if ($blog->image && str_contains($blog->image, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $blog->image));
        }

        $blog->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
