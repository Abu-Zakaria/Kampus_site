<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class PartnerLoginController extends Controller
{
    /**
     * Handle one-click instant magic login for approved partner users via signed URL.
     */
    public function magicLogin(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Verify cryptographic signature and expiration (accepts both absolute and relative signatures across local hosts)
        if (! $request->hasValidSignature() && ! $request->hasValidRelativeSignature()) {
            return redirect()->route('login', ['email' => $user->email])
                ->with('status', 'Your one-time login link has expired or is invalid. Please sign in with your credentials.');
        }

        // Ensure user has the Partner role
        $partnerRole = Role::firstOrCreate(['name' => 'Partner', 'guard_name' => 'web']);
        if (! $user->hasRole('Partner') && ! $user->hasRole('Super Admin')) {
            $user->assignRole($partnerRole);
        }

        // If a different user is currently authenticated, switch sessions cleanly
        if (Auth::check() && Auth::id() !== $user->id) {
            Auth::logout();
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        }

        // Authenticate the partner user
        Auth::login($user, remember: true);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // Check if user has not set their permanent password or needs to provide email
        $needsSetup = is_null($user->password_set_at) || empty($user->email) || str_ends_with($user->email, '@placeholder.local');

        if ($needsSetup) {
            return redirect()->route('partner.setup.show')
                ->with('status', "Welcome, {$user->name}! Please choose your permanent password to complete setup.");
        }

        return redirect()->intended(route('admin.dashboard', absolute: false))
            ->with('success', "Welcome to the  RMS Partner Portal, {$user->name}!");
    }
}
