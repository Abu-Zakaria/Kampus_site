<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CountryController extends Controller
{
    /**
     * Display a listing of countries.
     */
    public function index(): Response
    {
        $countries = Country::withCount('universities')->orderBy('name', 'asc')->get();

        $defaultCountries = [
            [
                'name' => 'United Kingdom',
                'slug' => 'united-kingdom',
                'country_code' => 'GB',
                'subtitle' => '150+ Partner Universities',
                'image' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'United States',
                'slug' => 'united-states',
                'country_code' => 'US',
                'subtitle' => '200+ Top Ranked Colleges',
                'image' => 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'Finland',
                'slug' => 'finland',
                'country_code' => 'FI',
                'subtitle' => '98% Visa Success Rate',
                'image' => 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'United Arab Emirates',
                'slug' => 'united-arab-emirates',
                'country_code' => 'AE',
                'subtitle' => 'Global Tech & Business Hubs',
                'image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'Canada',
                'slug' => 'canada',
                'country_code' => 'CA',
                'subtitle' => 'Post-Study Work Permits',
                'image' => 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'Australia',
                'slug' => 'australia',
                'country_code' => 'AU',
                'subtitle' => 'High Quality Education',
                'image' => 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=800',
            ],
        ];

        // Seed default destination countries if table is empty
        if ($countries->isEmpty()) {
            foreach ($defaultCountries as $c) {
                Country::create($c);
            }
            $countries = Country::withCount('universities')->orderBy('name', 'asc')->get();
        } else {
            // Update missing country_code / subtitle / image attributes for existing records
            foreach ($defaultCountries as $def) {
                $c = Country::where('slug', $def['slug'])->first();
                if ($c && (empty($c->country_code) || empty($c->image))) {
                    $c->update([
                        'country_code' => $c->country_code ?: $def['country_code'],
                        'subtitle' => $c->subtitle ?: $def['subtitle'],
                        'image' => $c->image ?: $def['image'],
                    ]);
                }
            }
            $countries = Country::withCount('universities')->orderBy('name', 'asc')->get();
        }

        return Inertia::render('Admin/Countries/Index', [
            'countries' => $countries,
        ]);
    }

    /**
     * Show the form for creating a new country.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Countries/Form', [
            'country' => null,
        ]);
    }

    /**
     * Store a newly created country in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:countries,slug',
            'country_code' => 'nullable|string|max:10',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,webp,svg|max:4096',
            ]);
            $path = $request->file('image')->store('countries', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (is_string($request->image)) {
            $validated['image'] = $request->image;
        }

        Country::create($validated);

        return redirect()->route('admin.countries.index')
            ->with('success', 'Country created successfully.');
    }

    /**
     * Show the form for editing the specified country.
     */
    public function edit(int $id): Response
    {
        $country = Country::findOrFail($id);

        return Inertia::render('Admin/Countries/Form', [
            'country' => $country,
        ]);
    }

    /**
     * Update the specified country in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $country = Country::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:countries,slug,' . $country->id,
            'country_code' => 'nullable|string|max:10',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,webp,svg|max:4096',
            ]);
            // Delete old file if local storage
            if ($country->image && str_starts_with($country->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $country->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('countries', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (is_string($request->image)) {
            $validated['image'] = $request->image;
        }

        $country->update($validated);

        return redirect()->route('admin.countries.index')
            ->with('success', 'Country updated successfully.');
    }

    /**
     * Remove the specified country from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $country = Country::findOrFail($id);

        if ($country->image && str_starts_with($country->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $country->image);
            Storage::disk('public')->delete($oldPath);
        }

        $country->delete();

        return redirect()->route('admin.countries.index')
            ->with('success', 'Country deleted successfully.');
    }

    /**
     * Download demo Excel template for bulk country uploads.
     */
    public function downloadSample(\App\Services\ExcelService $excelService)
    {
        return $excelService->generateCountriesSample();
    }

    /**
     * Bulk upload countries via Excel or CSV file.
     */
    public function bulkUpload(Request $request, \App\Services\ExcelService $excelService): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'update_existing' => 'nullable',
        ]);

        $updateExisting = $request->boolean('update_existing', true);
        $result = $excelService->importCountries($request->file('file'), $updateExisting);

        $msg = sprintf(
            'Bulk upload finished: %d created, %d updated, %d skipped.',
            $result['created'],
            $result['updated'],
            $result['skipped']
        );

        if (!empty($result['errors'])) {
            return redirect()->route('admin.countries.index')
                ->with('status', $msg)
                ->with('import_summary', $msg)
                ->with('import_errors', $result['errors']);
        }

        return redirect()->route('admin.countries.index')->with('success', $msg);
    }
}

