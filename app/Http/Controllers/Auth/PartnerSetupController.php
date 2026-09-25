<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PartnerApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PartnerSetupController extends Controller
{
    /**
     * Display the initial partner password and email setup form.
     */
    public function show(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $isEmailAvailable = !empty($user->email) && !str_ends_with($user->email, '@placeholder.local');
        $isPasswordSet = !is_null($user->password_set_at);

        // If user already set password and has valid email, redirect to dashboard
        if ($isPasswordSet && $isEmailAvailable) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Auth/PartnerSetupAccount', [
            'initialEmail' => $isEmailAvailable ? $user->email : '',
            'isEmailAvailable' => $isEmailAvailable,
            'partnerName' => $user->name,
        ]);
    }

    /**
     * Store the chosen password and confirmed email for the partner.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $oldEmail = $user->email;

        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->password_set_at = now();
        $user->save();

        // Also synchronize partner application record if matching original email
        if (!empty($oldEmail)) {
            PartnerApplication::where('email', $oldEmail)->update(['email' => $user->email]);
        }

        return redirect()->route('admin.dashboard')
            ->with('success', 'Your password has been successfully configured! Welcome to the  RMS Partner Portal.');
    }
}
