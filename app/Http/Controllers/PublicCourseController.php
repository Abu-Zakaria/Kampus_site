<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Course;
use App\Models\CourseSearch;
use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicCourseController extends Controller
{
    /**
     * Display public courses directory with dynamic search, level filters, destination filters, sorting and pagination.
     */
    public function index(Request $request): Response
    {
        $query = Course::with([
            'university:id,name,slug,location,logo,cover_image,country_id',
            'university.country:id,name,slug,country_code',
        ]);

        // 1. Search Query Filter & Popularity Tracking
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('level', 'like', "%{$search}%")
                  ->orWhere('duration', 'like', "%{$search}%")
                  ->orWhere('intake', 'like', "%{$search}%")
                  ->orWhereHas('university', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhereHas('country', function ($c) use ($search) {
                            $c->where('name', 'like', "%{$search}%")
                              ->orWhere('country_code', 'like', "%{$search}%");
                        });
                  });
            });

            // Track search keyword and course search frequency in real-time
            if (strlen($search) >= 2) {
                $searchRecord = CourseSearch::firstOrNew(['keyword' => $search]);
                $searchRecord->search_count = ($searchRecord->search_count ?? 0) + 1;
                $searchRecord->updated_at = now();
                $searchRecord->save();

                Course::where('title', 'like', "%{$search}%")->increment('search_count');
            }
        }

        // 2. Study Level Filter (Supports single value or array/comma-separated)
        if ($request->filled('level')) {
            $levels = is_array($request->input('level'))
                ? $request->input('level')
                : explode(',', $request->input('level'));
            $levels = array_filter(array_map('trim', $levels));
            if (!empty($levels)) {
                $query->whereIn('level', $levels);
            }
        }

        // 3. Destination / Country Filter
        if ($request->filled('country') && $request->input('country') !== 'All') {
            $country = trim($request->input('country'));
            $query->whereHas('university.country', function ($q) use ($country) {
                $q->where('name', $country)
                  ->orWhere('country_code', $country)
                  ->orWhere('slug', $country);
            });
        } elseif ($request->filled('destination') && $request->input('destination') !== 'All') {
            $destination = trim($request->input('destination'));
            $query->whereHas('university.country', function ($q) use ($destination) {
                $q->where('name', $destination)
                  ->orWhere('country_code', $destination)
                  ->orWhere('slug', $destination);
            });
        }

        // 4. University Filter
        if ($request->filled('university')) {
            $university = trim($request->input('university'));
            $query->whereHas('university', function ($q) use ($university) {
                $q->where('slug', $university)
                  ->orWhere('name', $university);
            });
        }

        // 5. Sorting
        $sort = $request->input('sort', 'popularity');
        if ($sort === 'fee-low') {
            // Sort by numerical extract from tuition fee
            $query->orderByRaw("CAST(REGEXP_REPLACE(tuition_fee, '[^0-9]', '') AS UNSIGNED) ASC");
        } elseif ($sort === 'fee-high') {
            $query->orderByRaw("CAST(REGEXP_REPLACE(tuition_fee, '[^0-9]', '') AS UNSIGNED) DESC");
        } elseif ($sort === 'title-asc') {
            $query->orderBy('title', 'asc');
        } else {
            $query->latest();
        }

        // Paginate 10 courses per page
        $courses = $query->paginate(20)->withQueryString();

        // Dynamic Filter Options for the Sidebar & Hero
        $destinations = Country::whereHas('universities.courses')
            ->withCount('universities')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'country_code']);

        $levels = Course::distinct()
            ->whereNotNull('level')
            ->where('level', '!=', '')
            ->pluck('level')
            ->values();

        $universities = University::whereHas('courses')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'country_id']);

        // Dynamic most recent and most searched popular course tags (max 10)
        $mostSearched = CourseSearch::orderByDesc('search_count')
            ->latest('updated_at')
            ->take(10)
            ->pluck('keyword')
            ->toArray();

        $recentCourses = Course::latest('created_at')
            ->take(10)
            ->pluck('title')
            ->toArray();

        $popularSearches = collect(array_merge($mostSearched, $recentCourses))
            ->map(fn ($item) => trim($item))
            ->filter()
            ->unique(fn ($item) => strtolower($item))
            ->take(10)
            ->values()
            ->all();

        $page = \App\Models\Page::where('slug', 'courses')->first();
        if ($page && !$page->is_active && !auth()->check()) {
            abort(404);
        }

        return Inertia::render('Courses', [
            'courses' => $courses,
            'destinations' => $destinations,
            'levels' => $levels,
            'universities' => $universities,
            'popularSearches' => $popularSearches,
            'page' => $page,
            'filters' => (object) array_filter($request->only(['search', 'level', 'country', 'sort']), fn ($v) => !is_null($v)),
        ]);
    }
}
