<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicUniversityController extends Controller
{
    /**
     * Display public universities directory with Inertia SPA search, country filters, and pagination.
     */
    public function index(Request $request): Response
    {
        $universities = University::with('country:id,name,slug,country_code')
            ->withCount('courses')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = trim($request->input('search'));
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('country') && $request->input('country') !== 'All', function ($query) use ($request) {
                $country = trim($request->input('country'));
                $query->whereHas('country', function ($q) use ($country) {
                    $q->where('country_code', $country)
                      ->orWhere('slug', $country)
                      ->orWhere('name', $country);
                });

                // Track and increment search popularity for this country
                Country::where('country_code', $country)
                    ->orWhere('slug', $country)
                    ->orWhere('name', $country)
                    ->increment('search_count');
            })
            ->latest()
            ->paginate(20)
            ->withQueryString(); // Crucial for keeping filters during pagination

        // If a free-text search was conducted, track matching country if applicable
        if ($request->filled('search')) {
            $searchKeyword = trim($request->input('search'));
            Country::where('name', 'like', "%{$searchKeyword}%")
                ->orWhere('slug', 'like', "%{$searchKeyword}%")
                ->increment('search_count');
        }

        // Top 10 most searched destination countries for Quick Filters
        $quickFilterDestinations = Country::whereHas('universities')
            ->orderByDesc('search_count')
            ->orderByDesc('is_featured')
            ->orderBy('name')
            ->take(10)
            ->get(['id', 'name', 'slug', 'country_code', 'search_count']);

        // Fetch dynamic destination countries from the database for the search dropdown
        $destinations = Country::whereHas('universities')
            ->withCount('universities')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'country_code']);

        $page = \App\Models\Page::where('slug', 'universities')->first();
        if ($page && !$page->is_active && !auth()->check()) {
            abort(404);
        }

        return Inertia::render('Universities', [
            'universities' => $universities,
            'destinations' => $destinations,
            'quickFilterDestinations' => $quickFilterDestinations,
            'page' => $page,
            'filters' => $request->only(['search', 'country']),
        ]);
    }

    /**
     * Display public university details page by slug, with eager loaded courses and country.
     */
    public function show(string $slug): Response
    {
        $university = University::where('slug', $slug)
            ->with(['courses', 'country'])
            ->firstOrFail();

        return Inertia::render('UniversityDetails', [
            'university' => $university,
        ]);
    }
}
