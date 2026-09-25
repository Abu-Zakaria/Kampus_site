<?php

namespace App\Console\Commands;

use App\Models\Blog;
use App\Services\HtmlSanitizerService;
use Illuminate\Console\Command;

class SanitizeBlogPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blogs:sanitize {--dry-run : Inspect what would change without modifying database records}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sanitize existing blog post content and excerpts against XSS vectors using strict allowlist';

    /**
     * Execute the console command.
     */
    public function handle(HtmlSanitizerService $sanitizer): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        $this->info($isDryRun ? '--- DRY RUN: Scanning blog posts for sanitization ---' : '--- Starting blog posts sanitization ---');

        $blogs = Blog::all();
        $total = $blogs->count();

        if ($total === 0) {
            $this->warn('No blog posts found in database.');
            return self::SUCCESS;
        }

        $updatedCount = 0;
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($blogs as $blog) {
            $originalContent = $blog->content ?? '';
            $originalExcerpt = $blog->excerpt ?? '';

            $cleanContent = $sanitizer->sanitize($originalContent);
            $cleanExcerpt = !empty($originalExcerpt) ? strip_tags($originalExcerpt) : $originalExcerpt;

            $contentChanged = ($originalContent !== $cleanContent);
            $excerptChanged = ($originalExcerpt !== $cleanExcerpt);

            if ($contentChanged || $excerptChanged) {
                $updatedCount++;

                if (!$isDryRun) {
                    $blog->content = $cleanContent;
                    $blog->excerpt = $cleanExcerpt;
                    // Preserve original update timestamps for historical integrity
                    $blog->withoutTimestamps(function () use ($blog) {
                        $blog->save();
                    });
                }
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        if ($isDryRun) {
            $this->info("[DRY RUN COMPLETE] {$updatedCount} of {$total} blog post(s) would be updated/cleaned.");
        } else {
            $this->info("[CLEANUP COMPLETE] Successfully sanitized {$updatedCount} of {$total} blog post(s).");
        }

        return self::SUCCESS;
    }
}
