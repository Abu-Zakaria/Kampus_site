<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\EnvEditorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class EnvSettingController extends Controller
{
    /**
     * Display the .env environment settings form.
     */
    public function index(EnvEditorService $envEditor): Response
    {
        $rawVars = $envEditor->getVariables();

        $appKey = $rawVars['APP_KEY'] ?? config('app.key', '');
        $maskedKey = $appKey ? (substr($appKey, 0, 14) . '••••••••••••••••••••••••' . substr($appKey, -4)) : 'Not set';

        $envData = [
            // App settings
            'APP_NAME' => $rawVars['APP_NAME'] ?? config('app.name', 'Kampus Edu'),
            'APP_ENV' => $rawVars['APP_ENV'] ?? config('app.env', 'local'),
            'APP_DEBUG' => filter_var($rawVars['APP_DEBUG'] ?? config('app.debug', true), FILTER_VALIDATE_BOOLEAN),
            'APP_URL' => $rawVars['APP_URL'] ?? config('app.url', 'http://localhost'),
            'APP_LOCALE' => $rawVars['APP_LOCALE'] ?? config('app.locale', 'en'),
            'APP_FALLBACK_LOCALE' => $rawVars['APP_FALLBACK_LOCALE'] ?? config('app.fallback_locale', 'en'),
            'APP_KEY_MASKED' => $maskedKey,

            // Mail settings
            'MAIL_MAILER' => $rawVars['MAIL_MAILER'] ?? config('mail.default', 'smtp'),
            'MAIL_HOST' => $rawVars['MAIL_HOST'] ?? config('mail.mailers.smtp.host', ''),
            'MAIL_PORT' => (string) ($rawVars['MAIL_PORT'] ?? config('mail.mailers.smtp.port', '587')),
            'MAIL_USERNAME' => $rawVars['MAIL_USERNAME'] ?? config('mail.mailers.smtp.username', ''),
            'MAIL_PASSWORD' => $rawVars['MAIL_PASSWORD'] ?? '',
            'MAIL_ENCRYPTION' => $rawVars['MAIL_ENCRYPTION'] ?? config('mail.mailers.smtp.encryption', 'tls'),
            'MAIL_FROM_ADDRESS' => $rawVars['MAIL_FROM_ADDRESS'] ?? config('mail.from.address', 'hello@kampus.com'),
            'MAIL_FROM_NAME' => $rawVars['MAIL_FROM_NAME'] ?? config('mail.from.name', 'Kampus Edu'),

            // Database settings
            'DB_CONNECTION' => $rawVars['DB_CONNECTION'] ?? config('database.default', 'mysql'),
            'DB_HOST' => $rawVars['DB_HOST'] ?? config('database.connections.mysql.host', '127.0.0.1'),
            'DB_PORT' => (string) ($rawVars['DB_PORT'] ?? config('database.connections.mysql.port', '3306')),
            'DB_DATABASE' => $rawVars['DB_DATABASE'] ?? config('database.connections.mysql.database', 'kampus'),
            'DB_USERNAME' => $rawVars['DB_USERNAME'] ?? config('database.connections.mysql.username', 'root'),
            'DB_PASSWORD' => $rawVars['DB_PASSWORD'] ?? '',

            // Session, Cache, Queue & Storage
            'SESSION_DRIVER' => $rawVars['SESSION_DRIVER'] ?? config('session.driver', 'database'),
            'SESSION_LIFETIME' => (string) ($rawVars['SESSION_LIFETIME'] ?? config('session.lifetime', '120')),
            'CACHE_STORE' => $rawVars['CACHE_STORE'] ?? config('cache.default', 'database'),
            'QUEUE_CONNECTION' => $rawVars['QUEUE_CONNECTION'] ?? config('queue.default', 'database'),
            'FILESYSTEM_DISK' => $rawVars['FILESYSTEM_DISK'] ?? config('filesystems.default', 'local'),

            // AWS S3
            'AWS_ACCESS_KEY_ID' => $rawVars['AWS_ACCESS_KEY_ID'] ?? '',
            'AWS_SECRET_ACCESS_KEY' => $rawVars['AWS_SECRET_ACCESS_KEY'] ?? '',
            'AWS_DEFAULT_REGION' => $rawVars['AWS_DEFAULT_REGION'] ?? 'us-east-1',
            'AWS_BUCKET' => $rawVars['AWS_BUCKET'] ?? '',
            'AWS_USE_PATH_STYLE_ENDPOINT' => filter_var($rawVars['AWS_USE_PATH_STYLE_ENDPOINT'] ?? false, FILTER_VALIDATE_BOOLEAN),

            // Logging
            'LOG_CHANNEL' => $rawVars['LOG_CHANNEL'] ?? config('logging.default', 'stack'),
            'LOG_LEVEL' => $rawVars['LOG_LEVEL'] ?? 'debug',

            // Redis
            'REDIS_HOST' => $rawVars['REDIS_HOST'] ?? '127.0.0.1',
            'REDIS_PORT' => (string) ($rawVars['REDIS_PORT'] ?? '6379'),
            'REDIS_PASSWORD' => $rawVars['REDIS_PASSWORD'] ?? '',
        ];

        return Inertia::render('Admin/Settings/Environment', [
            'env' => $envData,
            'systemInfo' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP CLI / Web Server',
                'env_writable' => is_writable(base_path('.env')),
            ],
        ]);
    }

    /**
     * Save updated .env environment variables.
     */
    public function update(Request $request, EnvEditorService $envEditor): RedirectResponse
    {
        $validated = $request->validate([
            // App
            'APP_NAME' => 'required|string|max:100',
            'APP_ENV' => 'required|in:local,production,staging,testing',
            'APP_DEBUG' => 'required|boolean',
            'APP_URL' => 'required|url',
            'APP_LOCALE' => 'required|string|max:10',
            'APP_FALLBACK_LOCALE' => 'required|string|max:10',

            // Mail
            'MAIL_MAILER' => 'required|string|in:smtp,sendmail,mailgun,ses,postmark,log,array',
            'MAIL_HOST' => 'nullable|string|max:255',
            'MAIL_PORT' => 'nullable|numeric|between:1,65535',
            'MAIL_USERNAME' => 'nullable|string|max:255',
            'MAIL_PASSWORD' => 'nullable|string|max:255',
            'MAIL_ENCRYPTION' => 'nullable|string|in:tls,ssl,none,null',
            'MAIL_FROM_ADDRESS' => 'nullable|email|max:255',
            'MAIL_FROM_NAME' => 'nullable|string|max:255',

            // Database
            'DB_CONNECTION' => 'required|string|in:mysql,pgsql,sqlite,sqlsrv',
            'DB_HOST' => 'nullable|string|max:255',
            'DB_PORT' => 'nullable|numeric|between:1,65535',
            'DB_DATABASE' => 'nullable|string|max:255',
            'DB_USERNAME' => 'nullable|string|max:255',
            'DB_PASSWORD' => 'nullable|string|max:255',

            // Session, Cache, Queue & Storage
            'SESSION_DRIVER' => 'required|string|in:database,file,cookie,redis,array',
            'SESSION_LIFETIME' => 'required|numeric|min:1|max:525600',
            'CACHE_STORE' => 'required|string|in:database,file,redis,array',
            'QUEUE_CONNECTION' => 'required|string|in:database,sync,redis',
            'FILESYSTEM_DISK' => 'required|string|in:local,public,s3',

            // AWS S3
            'AWS_ACCESS_KEY_ID' => 'nullable|string|max:255',
            'AWS_SECRET_ACCESS_KEY' => 'nullable|string|max:255',
            'AWS_DEFAULT_REGION' => 'nullable|string|max:50',
            'AWS_BUCKET' => 'nullable|string|max:255',
            'AWS_USE_PATH_STYLE_ENDPOINT' => 'nullable|boolean',

            // Logging
            'LOG_CHANNEL' => 'required|string|in:stack,single,daily,stderr,syslog,errorlog',
            'LOG_LEVEL' => 'required|string|in:debug,info,notice,warning,error,critical,alert,emergency',

            // Redis
            'REDIS_HOST' => 'nullable|string|max:255',
            'REDIS_PORT' => 'nullable|numeric|between:1,65535',
            'REDIS_PASSWORD' => 'nullable|string|max:255',
        ]);

        // Normalize encryption
        if (isset($validated['MAIL_ENCRYPTION']) && in_array($validated['MAIL_ENCRYPTION'], ['none', 'null', ''])) {
            $validated['MAIL_ENCRYPTION'] = 'null';
        }

        $success = $envEditor->update($validated);

        if (!$success) {
            return redirect()->back()->with('error', 'Unable to write to .env file. Please ensure file permissions are writable.');
        }

        return redirect()->route('admin.settings.env.index')
            ->with('success', 'Environment variables updated successfully! Configuration cache has been cleared.');
    }

    /**
     * Send a test email to verify SMTP settings.
     */
    public function testEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $recipient = $request->input('email');
        $appName = config('app.name', 'Kampus Edu');

        try {
            Mail::raw(
                "Hello!\n\nThis is a test email sent from your {$appName} Admin Dashboard to verify that your SMTP/Mail environment configuration is operating successfully.\n\nTimestamp: " . now()->toDateTimeString() . " UTC",
                function ($message) use ($recipient, $appName) {
                    $message->to($recipient)
                        ->subject("SMTP Test Email — {$appName}");
                }
            );

            return redirect()->back()
                ->with('success', "Test email was dispatched successfully to {$recipient}. Please check your inbox or spam folder.");
        } catch (\Throwable $e) {
            return redirect()->back()
                ->with('error', "Failed to dispatch test email: " . $e->getMessage());
        }
    }
}
