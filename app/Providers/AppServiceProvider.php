<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Implicitly grant Super Admin all permissions
        Gate::before(function ($user, $ability) {
            return ($user->id === 1 || $user->hasRole('Super Admin')) ? true : null;
        });

        // Share dynamic website and brand names with all email templates
        View::composer('emails.*', function ($view) {
            $data = $view->getData();
            $siteName = $data['siteName'] ?? Setting::get('site_name', config('app.name', 'RMS Consult'));
            $footerName = $data['footerName'] ?? Setting::get('footer_name', $siteName);

            $view->with([
                'siteName' => $siteName,
                'footerName' => $footerName,
            ]);
        });

        // Security Step 4b: Named Rate Limiters for public forms, lead captures, AI matcher, and global search
        RateLimiter::for('public-form', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('lead-capture', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('course-matcher', function (Request $request) {
            return Limit::perMinute(20)->by($request->ip());
        });

        RateLimiter::for('global-search', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });
    }
}
