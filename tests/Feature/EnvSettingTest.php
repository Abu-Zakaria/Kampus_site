<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\EnvEditorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class EnvSettingTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::firstOrCreate(['name' => 'manage-settings', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo('manage-settings');

        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
        ]);
        $this->admin->assignRole('Super Admin');

        $this->regularUser = User::factory()->create([
            'email' => 'user@test.com',
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/admin/settings/env');
        $response->assertRedirect('/login');
    }

    public function test_user_without_permission_is_forbidden(): void
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/settings/env');
        $response->assertForbidden();
    }

    public function test_admin_can_view_environment_settings(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/settings/env');
        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Settings/Environment')
                 ->has('env')
                 ->has('systemInfo')
        );
    }

    public function test_admin_can_update_environment_variables(): void
    {
        $tempEnvPath = tempnam(sys_get_temp_dir(), 'env_test_');
        File::put($tempEnvPath, "APP_NAME=OldName\nMAIL_FROM_ADDRESS=old@test.com\n");

        $envEditor = new EnvEditorService();
        $envEditor->setEnvPath($tempEnvPath);
        $this->app->instance(EnvEditorService::class, $envEditor);

        $response = $this->actingAs($this->admin)->post('/admin/settings/env', [
            'APP_NAME' => 'Kampus Test Platform',
            'APP_ENV' => 'local',
            'APP_DEBUG' => true,
            'APP_URL' => 'http://localhost:8000',
            'APP_LOCALE' => 'en',
            'APP_FALLBACK_LOCALE' => 'en',
            'MAIL_MAILER' => 'smtp',
            'MAIL_HOST' => 'sandbox.smtp.mailtrap.io',
            'MAIL_PORT' => 2525,
            'MAIL_USERNAME' => 'test_user',
            'MAIL_PASSWORD' => 'test_pass',
            'MAIL_ENCRYPTION' => 'tls',
            'MAIL_FROM_ADDRESS' => 'noreply@kampus.test',
            'MAIL_FROM_NAME' => 'Kampus Notifications',
            'DB_CONNECTION' => 'mysql',
            'DB_HOST' => '127.0.0.1',
            'DB_PORT' => 3306,
            'DB_DATABASE' => 'kampus_test',
            'DB_USERNAME' => 'root',
            'DB_PASSWORD' => 'secret',
            'SESSION_DRIVER' => 'database',
            'SESSION_LIFETIME' => 120,
            'CACHE_STORE' => 'database',
            'QUEUE_CONNECTION' => 'database',
            'FILESYSTEM_DISK' => 'local',
            'LOG_CHANNEL' => 'stack',
            'LOG_LEVEL' => 'debug',
            'AWS_DEFAULT_REGION' => 'us-east-1',
        ]);

        $response->assertRedirect('/admin/settings/env');
        $response->assertSessionHas('success');

        // Check that values are updated in the isolated test env
        $updatedVars = $envEditor->getVariables();
        $this->assertEquals('Kampus Test Platform', $updatedVars['APP_NAME']);
        $this->assertEquals('noreply@kampus.test', $updatedVars['MAIL_FROM_ADDRESS']);

        // Check that backup directory contains backups
        $backupDir = storage_path('app/backups/env');
        $this->assertTrue(File::isDirectory($backupDir));
        $this->assertNotEmpty(File::files($backupDir));

        // Clean up temp file
        if (File::exists($tempEnvPath)) {
            File::delete($tempEnvPath);
        }
    }

    public function test_admin_can_send_test_email(): void
    {
        Mail::fake();

        $response = $this->actingAs($this->admin)->post('/admin/settings/env/test-email', [
            'email' => 'recipient@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
