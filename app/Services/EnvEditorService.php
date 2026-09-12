<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class EnvEditorService
{
    /**
     * Whitelist of allowed configurable environment keys.
     */
    protected array $allowedKeys = [
        // App
        'APP_NAME',
        'APP_ENV',
        'APP_DEBUG',
        'APP_URL',
        'APP_LOCALE',
        'APP_FALLBACK_LOCALE',
        'APP_FAKER_LOCALE',

        // Mail
        'MAIL_MAILER',
        'MAIL_SCHEME',
        'MAIL_HOST',
        'MAIL_PORT',
        'MAIL_USERNAME',
        'MAIL_PASSWORD',
        'MAIL_ENCRYPTION',
        'MAIL_FROM_ADDRESS',
        'MAIL_FROM_NAME',

        // Database
        'DB_CONNECTION',
        'DB_HOST',
        'DB_PORT',
        'DB_DATABASE',
        'DB_USERNAME',
        'DB_PASSWORD',

        // Session, Cache, Queue & Storage
        'SESSION_DRIVER',
        'SESSION_LIFETIME',
        'SESSION_ENCRYPT',
        'CACHE_STORE',
        'FILESYSTEM_DISK',
        'QUEUE_CONNECTION',
        'BROADCAST_CONNECTION',

        // Logging
        'LOG_CHANNEL',
        'LOG_LEVEL',

        // AWS / S3
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_DEFAULT_REGION',
        'AWS_BUCKET',
        'AWS_USE_PATH_STYLE_ENDPOINT',

        // Redis / Memcached
        'REDIS_HOST',
        'REDIS_PORT',
        'REDIS_PASSWORD',
        'MEMCACHED_HOST',
    ];

    /**
     * Optional custom path to .env file (useful for isolated testing).
     */
    protected ?string $customEnvPath = null;

    public function setEnvPath(?string $path): self
    {
        $this->customEnvPath = $path;
        return $this;
    }

    /**
     * Path to .env file.
     */
    protected function envPath(): string
    {
        return $this->customEnvPath ?: base_path('.env');
    }

    /**
     * Get all parsed .env variables.
     */
    public function getVariables(): array
    {
        $path = $this->envPath();
        if (!File::exists($path)) {
            return [];
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES);
        $variables = [];

        foreach ($lines as $line) {
            $trimmed = trim($line);
            // Skip comments and empty lines
            if (empty($trimmed) || str_starts_with($trimmed, '#')) {
                continue;
            }

            if (str_contains($line, '=')) {
                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);

                // Strip surrounding quotes if present
                if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
                    (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
                    $value = substr($value, 1, -1);
                }

                $variables[$key] = $value;
            }
        }

        return $variables;
    }

    /**
     * Update environment variables safely.
     *
     * @param array $newValues Key-value pairs of variables to update
     * @return bool
     */
    public function update(array $newValues): bool
    {
        $path = $this->envPath();
        if (!File::exists($path)) {
            return false;
        }

        // 1. Create a timestamped backup before writing
        $this->backup();

        $content = File::get($path);
        $lines = explode("\n", $content);
        $updatedKeys = [];

        // Filter incoming values against the whitelist
        $filteredValues = array_intersect_key($newValues, array_flip($this->allowedKeys));

        foreach ($lines as $index => $line) {
            $trimmed = trim($line);
            if (empty($trimmed) || str_starts_with($trimmed, '#')) {
                continue;
            }

            if (str_contains($line, '=')) {
                [$key] = explode('=', $line, 2);
                $key = trim($key);

                if (array_key_exists($key, $filteredValues)) {
                    $formattedValue = $this->formatValue($filteredValues[$key]);
                    $lines[$index] = "{$key}={$formattedValue}";
                    $updatedKeys[] = $key;
                }
            }
        }

        // If any allowed keys were not present in .env, append them at the end
        $missingKeys = array_diff_key($filteredValues, array_flip($updatedKeys));
        if (!empty($missingKeys)) {
            $lines[] = "";
            $lines[] = "# Configured via Admin Settings";
            foreach ($missingKeys as $key => $value) {
                $formattedValue = $this->formatValue($value);
                $lines[] = "{$key}={$formattedValue}";
            }
        }

        // Write the updated lines back to .env
        File::put($path, implode("\n", $lines));

        // Clear configuration cache
        try {
            Artisan::call('config:clear');
        } catch (\Throwable $e) {
            // Log or ignore if config:clear is not critical at this second
        }

        return true;
    }

    /**
     * Format a value for safe storage in .env.
     */
    protected function formatValue(mixed $value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        $str = (string) $value;

        // If string is already 'true' or 'false'
        if (strtolower($str) === 'true' || strtolower($str) === 'false') {
            return strtolower($str);
        }

        // If empty
        if ($str === '') {
            return '';
        }

        // If value has spaces, hash, or quotes, wrap in double quotes
        if (preg_match('/\s|#|"|\'/', $str) || str_starts_with($str, '$') || str_contains($str, '${')) {
            $escaped = str_replace('"', '\"', $str);
            return "\"{$escaped}\"";
        }

        return $str;
    }

    /**
     * Backup current .env file into storage/app/backups/env.
     */
    public function backup(): ?string
    {
        $path = $this->envPath();
        if (!File::exists($path)) {
            return null;
        }

        $backupDir = storage_path('app/backups/env');
        if (!File::isDirectory($backupDir)) {
            File::makeDirectory($backupDir, 0755, true, true);
        }

        $timestamp = date('Y_m_d_His');
        $backupPath = "{$backupDir}/env_backup_{$timestamp}.env";
        File::copy($path, $backupPath);

        // Keep at most 10 recent backups
        $files = File::files($backupDir);
        if (count($files) > 10) {
            usort($files, fn ($a, $b) => $a->getMTime() <=> $b->getMTime());
            $toDelete = array_slice($files, 0, count($files) - 10);
            foreach ($toDelete as $file) {
                File::delete($file->getPathname());
            }
        }

        return $backupPath;
    }
}
