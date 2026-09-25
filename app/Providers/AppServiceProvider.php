<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Gate;
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
    }
}
