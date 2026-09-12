<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentAchievement;
use App\Models\StudentCertificate;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    /**
     * Update or create the student's personal & academic profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'nationality' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'current_education_level' => 'nullable|string|max:100',
            'target_destination' => 'nullable|string|max:100',
            'target_degree_level' => 'nullable|string|max:100',
            'target_intake_year' => 'nullable|string|max:50',
            'target_subject_area' => 'nullable|string|max:150',
            'bio' => 'nullable|string|max:2000',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_website' => 'nullable|url|max:255',
        ]);

        StudentProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return back()->with('success', 'Profile information updated successfully!');
    }

    /**
     * Add a new certificate with optional document/image upload.
     */
    public function storeCertificate(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuing_organization' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:500',
            'score' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240', // 10MB max
        ]);

        $filePath = null;
        $fileName = null;
        $fileType = null;
        $fileSize = null;

        if ($request->hasFile('file')) {
            $uploaded = $request->file('file');
            $storedPath = $uploaded->store('student_certificates', 'public');
            $filePath = '/storage/' . $storedPath;
            $fileName = $uploaded->getClientOriginalName();
            $fileType = $uploaded->getClientOriginalExtension();
            $fileSize = $uploaded->getSize();
        }

        StudentCertificate::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'issuing_organization' => $validated['issuing_organization'],
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'credential_id' => $validated['credential_id'] ?? null,
            'credential_url' => $validated['credential_url'] ?? null,
            'score' => $validated['score'] ?? null,
            'description' => $validated['description'] ?? null,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'status' => 'submitted',
        ]);

        return back()->with('success', 'Certificate added successfully!');
    }

    /**
     * Update an existing certificate.
     */
    public function updateCertificate(Request $request, $id)
    {
        $user = $request->user();
        $certificate = StudentCertificate::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuing_organization' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:500',
            'score' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ]);

        $data = [
            'title' => $validated['title'],
            'issuing_organization' => $validated['issuing_organization'],
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'credential_id' => $validated['credential_id'] ?? null,
            'credential_url' => $validated['credential_url'] ?? null,
            'score' => $validated['score'] ?? null,
            'description' => $validated['description'] ?? null,
        ];

        if ($request->hasFile('file')) {
            // Delete old file if present
            if ($certificate->file_path && str_starts_with($certificate->file_path, '/storage/')) {
                $oldRel = str_replace('/storage/', '', $certificate->file_path);
                Storage::disk('public')->delete($oldRel);
            }

            $uploaded = $request->file('file');
            $storedPath = $uploaded->store('student_certificates', 'public');
            $data['file_path'] = '/storage/' . $storedPath;
            $data['file_name'] = $uploaded->getClientOriginalName();
            $data['file_type'] = $uploaded->getClientOriginalExtension();
            $data['file_size'] = $uploaded->getSize();
        }

        $certificate->update($data);

        return back()->with('success', 'Certificate updated successfully!');
    }

    /**
     * Delete a certificate.
     */
    public function destroyCertificate(Request $request, $id)
    {
        $user = $request->user();
        $certificate = StudentCertificate::where('user_id', $user->id)->findOrFail($id);

        if ($certificate->file_path && str_starts_with($certificate->file_path, '/storage/')) {
            $oldRel = str_replace('/storage/', '', $certificate->file_path);
            Storage::disk('public')->delete($oldRel);
        }

        $certificate->delete();

        return back()->with('success', 'Certificate deleted successfully!');
    }

    /**
     * Store a new achievement.
     */
    public function storeAchievement(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'issuer_or_organization' => 'nullable|string|max:255',
            'achievement_date' => 'nullable|date',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ]);

        $filePath = null;
        $fileName = null;
        $fileType = null;
        $fileSize = null;

        if ($request->hasFile('file')) {
            $uploaded = $request->file('file');
            $storedPath = $uploaded->store('student_achievements', 'public');
            $filePath = '/storage/' . $storedPath;
            $fileName = $uploaded->getClientOriginalName();
            $fileType = $uploaded->getClientOriginalExtension();
            $fileSize = $uploaded->getSize();
        }

        StudentAchievement::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'issuer_or_organization' => $validated['issuer_or_organization'] ?? null,
            'achievement_date' => $validated['achievement_date'] ?? null,
            'description' => $validated['description'] ?? null,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'status' => 'submitted',
        ]);

        return back()->with('success', 'Achievement added successfully!');
    }

    /**
     * Update an achievement.
     */
    public function updateAchievement(Request $request, $id)
    {
        $user = $request->user();
        $achievement = StudentAchievement::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'issuer_or_organization' => 'nullable|string|max:255',
            'achievement_date' => 'nullable|date',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ]);

        $data = [
            'title' => $validated['title'],
            'category' => $validated['category'],
            'issuer_or_organization' => $validated['issuer_or_organization'] ?? null,
            'achievement_date' => $validated['achievement_date'] ?? null,
            'description' => $validated['description'] ?? null,
        ];

        if ($request->hasFile('file')) {
            if ($achievement->file_path && str_starts_with($achievement->file_path, '/storage/')) {
                $oldRel = str_replace('/storage/', '', $achievement->file_path);
                Storage::disk('public')->delete($oldRel);
            }

            $uploaded = $request->file('file');
            $storedPath = $uploaded->store('student_achievements', 'public');
            $data['file_path'] = '/storage/' . $storedPath;
            $data['file_name'] = $uploaded->getClientOriginalName();
            $data['file_type'] = $uploaded->getClientOriginalExtension();
            $data['file_size'] = $uploaded->getSize();
        }

        $achievement->update($data);

        return back()->with('success', 'Achievement updated successfully!');
    }

    /**
     * Delete an achievement.
     */
    public function destroyAchievement(Request $request, $id)
    {
        $user = $request->user();
        $achievement = StudentAchievement::where('user_id', $user->id)->findOrFail($id);

        if ($achievement->file_path && str_starts_with($achievement->file_path, '/storage/')) {
            $oldRel = str_replace('/storage/', '', $achievement->file_path);
            Storage::disk('public')->delete($oldRel);
        }

        $achievement->delete();

        return back()->with('success', 'Achievement deleted successfully!');
    }
}
