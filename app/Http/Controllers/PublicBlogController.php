<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicBlogController extends Controller
{
    /**
     * Display a listing of published blogs with pagination.
     */
    public function index(Request $request): Response
    {
        $query = Blog::where('is_published', true);

        // Optional search filter & search popularity tracking
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });

            if (strlen($search) >= 2) {
                Blog::where('title', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->increment('search_count');

                \DB::table('blog_searches')->updateOrInsert(
                    ['keyword' => $search],
                    ['search_count' => \DB::raw('search_count + 1'), 'updated_at' => now(), 'created_at' => now()]
                );
            }
        }

        // Optional category filter & category popularity tracking
        if ($request->filled('category') && $request->input('category') !== 'All') {
            $cat = trim($request->input('category'));
            $query->where('category', $cat);

            Blog::where('category', $cat)->increment('search_count');
        }

        $blogs = $query->latest()->paginate(20)->withQueryString();

        // Most recent and most searched categories (max 10)
        $categories = Blog::where('is_published', true)
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->select('category', \DB::raw('SUM(search_count) as total_searches'), \DB::raw('MAX(created_at) as latest_created'))
            ->groupBy('category')
            ->orderByDesc('total_searches')
            ->orderByDesc('latest_created')
            ->take(10)
            ->pluck('category')
            ->values();

        $page = \App\Models\Page::where('slug', 'blog')->first();
        if ($page && !$page->is_active && !auth()->check()) {
            abort(404);
        }

        return Inertia::render('Public/Blogs/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'page' => $page,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', 'All'),
            ],
        ]);
    }

    /**
     * Display the specified blog post by slug.
     */
    public function show(string $slug): Response
    {
        $blog = Blog::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Fetch 3 related/recent published blogs for the bottom section
        $relatedBlogs = Blog::where('id', '!=', $blog->id)
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Public/Blogs/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }
}
