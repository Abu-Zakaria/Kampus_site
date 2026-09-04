<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display a listing of all pages.
     */
    public function index()
    {
        $pages = Page::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create()
    {
        return Inertia::render('Admin/Pages/Create');
    }

    /**
     * Store a newly created page in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:1000',
            'meta_keywords' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
            'show_in_navbar' => 'nullable|boolean',
            'show_in_footer' => 'nullable|boolean',
            'content' => 'nullable|array',
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['show_in_navbar'] = $request->boolean('show_in_navbar');
        $validated['show_in_footer'] = $request->boolean('show_in_footer');

        $page = Page::create($validated);

        return redirect()->route('admin.pages.index')
            ->with('success', "Page '{$page->name}' created successfully.");
    }

    /**
     * Show the form for editing the specified page.
     */
    public function edit($id)
    {
        $page = Page::findOrFail($id);

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified page in storage.
     */
    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . $page->id,
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:1000',
            'meta_keywords' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
            'show_in_navbar' => 'nullable|boolean',
            'show_in_footer' => 'nullable|boolean',
            'content' => 'nullable|array',
        ]);

        $coreSlugs = [
            '/', 'home', 'about', 'services', 'universities', 'courses', 'blog', 'contact',
            'partner-with-us', 'partner', 'scholarships', 'visa-guide', 'privacy-policy',
            'terms-of-service', 'terms', 'cookie-preferences', 'accreditation'
        ];

        if (in_array(strtolower($page->slug), $coreSlugs)) {
            $validated['slug'] = $page->slug;
        }

        $validated['is_active'] = $request->boolean('is_active');
        $validated['show_in_navbar'] = $request->boolean('show_in_navbar');
        $validated['show_in_footer'] = $request->boolean('show_in_footer');

        $page->update($validated);

        if (strtolower($page->slug) === 'home') {
            $heroImage = $validated['content']['hero_image'] ?? '';
            Setting::updateOrCreate(
                ['key' => 'home_hero_image'],
                ['value' => $heroImage ? (string) $heroImage : '']
            );
        }

        return redirect()->route('admin.pages.index')
            ->with('success', "Page '{$page->name}' updated successfully.");
    }

    /**
     * Upload an image for dynamic page builder blocks.
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $path = $request->file('image')->store('pages', 'public');

        return response()->json([
            'url' => '/storage/' . $path,
        ]);
    }

    /**
     * Remove the specified page from storage if it is not a core protected page.
     */
    public function destroy($id)
    {
        $page = Page::findOrFail($id);

        $coreSlugs = [
            '/',
            'home',
            'about',
            'services',
            'universities',
            'courses',
            'blog',
            'contact',
            'partner-with-us',
            'partner',
            'scholarships',
            'visa-guide',
            'privacy-policy',
            'terms-of-service',
            'terms',
            'cookie-preferences',
            'accreditation'
        ];

        if (in_array(strtolower($page->slug), $coreSlugs)) {
            return back()->with('error', 'Core system pages cannot be deleted.');
        }

        $page->delete();

        return redirect()->route('admin.pages.index')
            ->with('success', "Page '{$page->name}' deleted successfully.");
    }
}
