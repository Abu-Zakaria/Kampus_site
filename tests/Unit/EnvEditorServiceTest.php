<?php

namespace Tests\Unit;

use App\Services\EnvEditorService;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class EnvEditorServiceTest extends TestCase
{
    protected string $tempEnvPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tempEnvPath = tempnam(sys_get_temp_dir(), 'test_env_');
    }

    protected function tearDown(): void
    {
        if (File::exists($this->tempEnvPath)) {
            File::delete($this->tempEnvPath);
        }
        parent::tearDown();
    }

    public function test_production_environment_removes_db_keys_from_allowed_keys(): void
    {
        $service = new EnvEditorService();

        // Simulate local environment
        config(['app.env' => 'local']);
        $localKeys = $service->getAllowedKeys();
        $this->assertContains('DB_PASSWORD', $localKeys);
        $this->assertContains('DB_HOST', $localKeys);

        // Simulate production environment
        $this->app['env'] = 'production';
        config(['app.env' => 'production']);
        $prodKeys = $service->getAllowedKeys();

        $this->assertNotContains('DB_PASSWORD', $prodKeys);
        $this->assertNotContains('DB_HOST', $prodKeys);
        $this->assertNotContains('DB_DATABASE', $prodKeys);
        $this->assertNotContains('DB_USERNAME', $prodKeys);
        $this->assertNotContains('DB_PORT', $prodKeys);
        $this->assertNotContains('DB_CONNECTION', $prodKeys);

        // Reset
        $this->app['env'] = 'testing';
        config(['app.env' => 'testing']);
    }

    public function test_update_skips_blank_or_placeholder_secrets_so_passwords_are_preserved(): void
    {
        $initialContent = <<<ENV
APP_NAME="Original App"
DB_PASSWORD=SuperSecretDbPassword123
MAIL_PASSWORD=SuperSecretMailPassword456
AWS_SECRET_ACCESS_KEY=SuperSecretAwsKey789
ENV;

        File::put($this->tempEnvPath, $initialContent);

        $service = new EnvEditorService();
        $service->setEnvPath($this->tempEnvPath);

        // Attempt updating with blank / placeholder passwords
        $service->update([
            'APP_NAME' => 'Updated App',
            'DB_PASSWORD' => '',
            'MAIL_PASSWORD' => null,
            'AWS_SECRET_ACCESS_KEY' => '•••••••• (unchanged)',
        ]);

        $variables = $service->getVariables();

        $this->assertEquals('Updated App', $variables['APP_NAME']);
        // Crucial: Existing passwords must NOT be wiped
        $this->assertEquals('SuperSecretDbPassword123', $variables['DB_PASSWORD']);
        $this->assertEquals('SuperSecretMailPassword456', $variables['MAIL_PASSWORD']);
        $this->assertEquals('SuperSecretAwsKey789', $variables['AWS_SECRET_ACCESS_KEY']);
    }
}
