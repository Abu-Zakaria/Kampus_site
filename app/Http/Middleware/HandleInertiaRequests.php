<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use App\Models\ContactMessage;
use App\Models\Faq;
use App\Models\Page;
use App\Models\Setting;
use App\Models\StudentApplication;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'roles' => $request->user()->roles->pluck('name')->toArray(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name')->toArray(),
                    'is_super_admin' => $request->user()->id === 1 || $request->user()->hasRole('Super Admin'),
                    'unreadNotifications' => $request->user()->unreadNotifications()->take(15)->get(),
                    'notifications' => $request->user()->notifications()->take(15)->get(),
                    'unread_notifications_count' => $request->user()->unreadNotifications()->count(),
                ]) : null,
            ],
            'nav_pages' => fn () => Page::where('is_active', true)
                ->where('show_in_navbar', true)
                ->select('id', 'name', 'slug')
                ->get(),
            'footer_pages' => fn () => Page::where('is_active', true)
                ->where('show_in_footer', true)
                ->select('id', 'name', 'slug')
                ->get(),
            'faqs' => fn () => Faq::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get(),
            'globalBranches' => fn () => Branch::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get(),
            'globalCountries' => fn () => \App\Models\Country::orderBy('name', 'asc')
                ->select('id', 'name', 'slug', 'country_code', 'is_featured')
                ->get(),
            'globalCountriesCount' => fn () => \App\Models\Country::count(),
            'globalUniversitiesCount' => fn () => \App\Models\University::count(),
            'globalSettings' => fn () => Setting::pluck('value', 'key')->toArray(),
            'unread_student_messages_count' => fn () => $request->user() ? (int) \App\Models\StudentConversation::where('user_id', $request->user()->id)->sum('student_unread_count') : 0,
            'unread_admin_messages_count' => fn () => $request->user() && ($request->user()->can('manage-inquiries') || $request->user()->id === 1) ? (int) \App\Models\StudentConversation::where('admin_unread_count', '>', 0)->count() : 0,
            'unread_admin_inquiries_count' => fn () => $request->user() && ($request->user()->can('manage-inquiries') || $request->user()->id === 1) ? (int) ContactMessage::where('is_read', false)->count() : 0,
            'pending_applications_count' => fn () => $request->user() && ($request->user()->can('manage-inquiries') || $request->user()->id === 1) ? (int) StudentApplication::where('status', 'pending')->count() : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
