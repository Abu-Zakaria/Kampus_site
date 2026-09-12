<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PartnerApplication;
use App\Models\Setting;
use App\Models\User;
use App\Mail\PartnerApprovedMail;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PartnerController extends Controller
{
    /**
     * Display a listing of all partner applications.
     */
    public function index()
    {
        $applications = PartnerApplication::orderBy('id', 'desc')->get();
        $partnerModalParagraph = Setting::where('key', 'partner_modal_paragraph')->value('value') 
            ?? 'Join our global higher education network. Register your agency below to collaborate with top universities worldwide and streamline student admissions.';

        return Inertia::render('Admin/Partners/Index', [
            'applications' => $applications,
            'partnerModalParagraph' => $partnerModalParagraph,
        ]);
    }

    /**
     * Update the popup modal introductory paragraph text.
     */
    public function updatePopupParagraph(Request $request)
    {
        $validated = $request->validate([
            'partner_modal_paragraph' => 'nullable|string|max:1000',
        ]);

        Setting::updateOrCreate(
            ['key' => 'partner_modal_paragraph'],
            ['value' => $validated['partner_modal_paragraph'] ?? '']
        );

        return back()->with('success', 'Partner popup modal paragraph updated successfully.');
    }

    /**
     * Update the status of a partner application.
     */
    public function update(Request $request, $id)
    {
        $application = PartnerApplication::findOrFail($id);
        $previousStatus = $application->status;

        $validated = $request->validate([
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        $application->update($validated);

        $feedbackMessage = "Application status updated to \"{$validated['status']}\".";

        // If newly approved, automatically provision user account and send magic activation link email
        if ($validated['status'] === 'approved' && $previousStatus !== 'approved') {
            $email = $application->email;
            $user = !empty($email) ? User::where('email', $email)->first() : null;

            if (!$user) {
                $user = User::create([
                    'name' => $application->contact_person ?: $application->company_name,
                    'email' => !empty($email) ? $email : 'partner-' . $application->id . '@placeholder.local',
                    'password' => Hash::make(Str::random(32)),
                    'password_set_at' => null, // Requires permanent password setup upon login
                ]);
            }

            // Ensure 'Partner' role exists with standard limited permissions
            $partnerRole = Role::firstOrCreate(['name' => 'Partner', 'guard_name' => 'web']);
            if ($partnerRole->wasRecentlyCreated) {
                $partnerRole->syncPermissions(['manage-universities', 'manage-courses']);
            }

            // Assign Partner role if not already assigned
            if (! $user->hasRole('Partner') && ! $user->hasRole('Super Admin')) {
                $user->assignRole($partnerRole);
            }

            // Generate secure 7-day one-click magic login URL using current host
            $magicLoginUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'partner.magic-login',
                now()->addDays(7),
                ['user' => $user->id]
            );

            // Dispatch welcome approval email to queue
            $targetEmail = (!empty($user->email) && !str_ends_with($user->email, '@placeholder.local'))
                ? $user->email
                : $application->email;

            if (!empty($targetEmail) && !str_ends_with($targetEmail, '@placeholder.local')) {
                try {
                    Mail::to($targetEmail)->queue(new PartnerApprovedMail(
                        $application,
                        $user,
                        $magicLoginUrl
                    ));
                    $feedbackMessage = "Partner approved! Magic activation link queued for delivery to {$targetEmail}.";
                } catch (\Throwable $e) {
                    Log::error('Failed to queue partner approval email: ' . $e->getMessage());
                    $feedbackMessage = "Partner approved and user account created (role: Partner), but queuing email failed.";
                }
            } else {
                $feedbackMessage = "Partner approved! No email was found on this application. Activation URL: {$magicLoginUrl}";
            }
        }

        return back()->with('success', $feedbackMessage);
    }

    /**
     * Remove the specified partner application.
     */
    public function destroy($id)
    {
        $application = PartnerApplication::findOrFail($id);
        $application->delete();

        return redirect()->route('admin.partners.index')
            ->with('success', 'Partner application deleted successfully.');
    }

    /**
     * Store a new partner application from the public-facing form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'years_in_business' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
        ]);

        $application = PartnerApplication::create([
            ...$validated,
            'status' => 'pending',
        ]);

        // Dispatch email notification to admin(s)
        \App\Services\AdminNotificationService::notifyPartnerApplication($application);

        return back()->with('success', 'Thank you! Your partnership application has been submitted. Our team will contact you shortly.');
    }
}
