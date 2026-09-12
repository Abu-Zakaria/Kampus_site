<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UniversityController extends Controller
{
    /**
     * Display a listing of universities.
     */
    public function index()
    {
        $universities = University::with('country')->withCount('courses')->orderBy('id', 'desc')->get();

        // Seed default universities if database table is empty
        if ($universities->isEmpty()) {
            $uk = Country::firstOrCreate(['slug' => 'united-kingdom'], ['name' => 'United Kingdom']);
            $usa = Country::firstOrCreate(['slug' => 'united-states'], ['name' => 'United States']);
            $finland = Country::firstOrCreate(['slug' => 'finland'], ['name' => 'Finland']);
            $uae = Country::firstOrCreate(['slug' => 'united-arab-emirates'], ['name' => 'United Arab Emirates']);

            $defaultUniversities = [
                [
                    'country_id' => $uk->id,
                    'name' => 'University of Oxford',
                    'slug' => 'university-of-oxford',
                    'location' => 'Oxford, United Kingdom',
                    'description' => 'The University of Oxford is a collegiate research university in Oxford, England. It has a evidence-based history of teaching and research date back to 1096.',
                    'cover_image' => 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80',
                    'features' => ['QS World Rank #1', 'High Employability', '100% Research Excellence', 'Global Alumni Network']
                ],
                [
                    'country_id' => $usa->id,
                    'name' => 'Harvard University',
                    'slug' => 'harvard-university',
                    'location' => 'Cambridge, Massachusetts, USA',
                    'description' => 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts, established in 1636.',
                    'cover_image' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
                    'features' => ['Ivy League Member', 'Top Business & Law Schools', 'Need-Blind Financial Aid']
                ],
                [
                    'country_id' => $finland->id,
                    'name' => 'University of Helsinki',
                    'slug' => 'university-of-helsinki',
                    'location' => 'Helsinki, Finland',
                    'description' => 'The University of Helsinki is the oldest and largest institution of academic education in Finland, established in 1640.',
                    'cover_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
                    'features' => ['Top 1% Global Ranking', '50-100% Tuition Waivers', 'Post-Study Work Permit']
                ],
                [
                    'country_id' => $uae->id,
                    'name' => 'Middlesex University Dubai',
                    'slug' => 'middlesex-university-dubai',
                    'location' => 'Dubai Knowledge Park, UAE',
                    'description' => 'Middlesex University Dubai is the first overseas campus of the renowned Middlesex University in London.',
                    'cover_image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                    'features' => ['UK Degree in Dubai', 'No IELTS Option Available', 'Attractive Merit Scholarships']
                ]
            ];

            foreach ($defaultUniversities as $u) {
                University::create($u);
            }

            $universities = University::with('country')->withCount('courses')->orderBy('id', 'desc')->get();
        } else {
            // Auto link country_id for pre-existing records if null
            $countriesMap = Country::all()->keyBy('slug');
            foreach ($universities as $uni) {
                if (!$uni->country_id) {
                    if (str_contains(strtolower($uni->location), 'united kingdom') || str_contains(strtolower($uni->location), 'oxford') || str_contains(strtolower($uni->location), 'london')) {
                        $uni->update(['country_id' => $countriesMap->get('united-kingdom')?->id]);
                    } elseif (str_contains(strtolower($uni->location), 'usa') || str_contains(strtolower($uni->location), 'massachusetts') || str_contains(strtolower($uni->location), 'states')) {
                        $uni->update(['country_id' => $countriesMap->get('united-states')?->id]);
                    } elseif (str_contains(strtolower($uni->location), 'finland') || str_contains(strtolower($uni->location), 'helsinki')) {
                        $uni->update(['country_id' => $countriesMap->get('finland')?->id]);
                    } elseif (str_contains(strtolower($uni->location), 'uae') || str_contains(strtolower($uni->location), 'dubai')) {
                        $uni->update(['country_id' => $countriesMap->get('united-arab-emirates')?->id]);
                    }
                }
            }
        }

        return Inertia::render('Admin/Universities/Index', [
            'universities' => $universities,
        ]);
    }

    /**
     * Show the form for creating a new university.
     */
    public function create()
    {
        $countries = Country::select('id', 'name')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Universities/Form', [
            'university' => null,
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created university in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'country_id' => 'nullable|exists:countries,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:universities,slug',
            'location' => 'required|string|max:255',
            'website' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'cover_image' => 'nullable',
            'logo' => 'nullable',
        ]);

        // Handle cover_image file upload
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = '/storage/' . $request->file('cover_image')->store('universities/covers', 'public');
        } elseif (is_string($request->input('cover_image'))) {
            $validated['cover_image'] = $request->input('cover_image');
        }

        // Handle logo file upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = '/storage/' . $request->file('logo')->store('universities/logos', 'public');
        } elseif (is_string($request->input('logo'))) {
            $validated['logo'] = $request->input('logo');
        }

        University::create($validated);

        return redirect()->route('admin.universities.index')
            ->with('success', 'University created successfully.');
    }

    /**
     * Show the form for editing the specified university.
     */
    public function edit($id)
    {
        $university = University::findOrFail($id);
        $countries = Country::select('id', 'name')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Universities/Form', [
            'university' => $university,
            'countries' => $countries,
        ]);
    }

    /**
     * Update the specified university in storage.
     */
    public function update(Request $request, $id)
    {
        $university = University::findOrFail($id);

        $validated = $request->validate([
            'country_id' => 'nullable|exists:countries,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:universities,slug,' . $university->id,
            'location' => 'required|string|max:255',
            'website' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'cover_image' => 'nullable',
            'logo' => 'nullable',
        ]);

        // Handle cover_image file upload
        if ($request->hasFile('cover_image')) {
            if ($university->cover_image && str_contains($university->cover_image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $university->cover_image);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['cover_image'] = '/storage/' . $request->file('cover_image')->store('universities/covers', 'public');
        } elseif ($request->input('cover_image') === null) {
            $validated['cover_image'] = $university->cover_image;
        }

        // Handle logo file upload
        if ($request->hasFile('logo')) {
            if ($university->logo && str_contains($university->logo, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $university->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['logo'] = '/storage/' . $request->file('logo')->store('universities/logos', 'public');
        } elseif ($request->input('logo') === null) {
            $validated['logo'] = $university->logo;
        }

        $university->update($validated);

        return redirect()->route('admin.universities.index')
            ->with('success', 'University updated successfully.');
    }

    /**
     * Remove the specified university from storage.
     */
    public function destroy($id)
    {
        $university = University::findOrFail($id);
        
        // Remove storage images if present
        if ($university->cover_image && str_contains($university->cover_image, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $university->cover_image));
        }
        if ($university->logo && str_contains($university->logo, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $university->logo));
        }

        $university->delete();

        return redirect()->route('admin.universities.index')
            ->with('success', 'University deleted successfully.');
    }

    /**
     * Download demo Excel template for bulk university uploads.
     */
    public function downloadSample(\App\Services\ExcelService $excelService)
    {
        return $excelService->generateUniversitiesSample();
    }

    /**
     * Bulk upload universities via Excel or CSV file.
     */
    public function bulkUpload(Request $request, \App\Services\ExcelService $excelService)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'update_existing' => 'nullable',
        ]);

        $updateExisting = $request->boolean('update_existing', true);
        $result = $excelService->importUniversities($request->file('file'), $updateExisting);

        $msg = sprintf(
            'Bulk upload finished: %d created, %d updated, %d skipped.',
            $result['created'],
            $result['updated'],
            $result['skipped']
        );

        if (!empty($result['errors'])) {
            return redirect()->route('admin.universities.index')
                ->with('status', $msg)
                ->with('import_summary', $msg)
                ->with('import_errors', $result['errors']);
        }

        return redirect()->route('admin.universities.index')->with('success', $msg);
    }
}

