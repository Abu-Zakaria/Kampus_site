<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroSlideshowController extends Controller
{
    /**
     * Curated high-resolution default slideshow images for study abroad & campuses.
     */
    protected array $defaultImages = [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    ];

    /**
     * Display the Hero Slideshow management view.
     */
    public function index()
    {
        $setting = Setting::where('key', 'hero_slideshow_images')->first();
        $images = [];

        if ($setting && !empty($setting->value)) {
            $decoded = json_decode($setting->value, true);
            if (is_array($decoded) && count($decoded) > 0) {
                $images = $decoded;
            }
        }

        // If no images set yet, seed with curated defaults
        if (empty($images)) {
            $images = $this->defaultImages;
            Setting::updateOrCreate(
                ['key' => 'hero_slideshow_images'],
                ['value' => json_encode($images)]
            );
        }

        return Inertia::render('Admin/Slideshow/Index', [
            'slides' => $images,
            'defaultSlides' => $this->defaultImages,
        ]);
    }

    /**
     * Upload one or multiple new images and add them to the slideshow.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'images.*' => 'nullable|image|max:10240',
            'image' => 'nullable|image|max:10240',
        ]);

        $setting = Setting::where('key', 'hero_slideshow_images')->first();
        $currentImages = [];
        if ($setting && !empty($setting->value)) {
            $decoded = json_decode($setting->value, true);
            if (is_array($decoded)) {
                $currentImages = $decoded;
            }
        }
        if (empty($currentImages)) {
            $currentImages = $this->defaultImages;
        }

        $newPaths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('slideshow', 'public');
                $newPaths[] = '/storage/' . $path;
            }
        } elseif ($request->hasFile('image')) {
            $path = $request->file('image')->store('slideshow', 'public');
            $newPaths[] = '/storage/' . $path;
        }

        if (!empty($newPaths)) {
            $updated = array_merge($currentImages, $newPaths);
            Setting::updateOrCreate(
                ['key' => 'hero_slideshow_images'],
                ['value' => json_encode($updated)]
            );

            return redirect()->back()->with('success', count($newPaths) . ' slideshow image(s) uploaded successfully.');
        }

        return redirect()->back()->with('error', 'No valid image file uploaded.');
    }

    /**
     * Replace a single slide at the given index.
     */
    public function replace(Request $request, $index)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $setting = Setting::where('key', 'hero_slideshow_images')->first();
        $currentImages = [];
        if ($setting && !empty($setting->value)) {
            $decoded = json_decode($setting->value, true);
            if (is_array($decoded)) {
                $currentImages = $decoded;
            }
        }
        if (empty($currentImages)) {
            $currentImages = $this->defaultImages;
        }

        $idx = (int) $index;
        if (!isset($currentImages[$idx])) {
            return redirect()->back()->with('error', 'Slide index not found.');
        }

        $path = $request->file('image')->store('slideshow', 'public');
        $currentImages[$idx] = '/storage/' . $path;

        Setting::updateOrCreate(
            ['key' => 'hero_slideshow_images'],
            ['value' => json_encode(array_values($currentImages))]
        );

        return redirect()->back()->with('success', 'Slide image #' . ($idx + 1) . ' replaced successfully.');
    }

    /**
     * Save updated slides array (reordering or custom URL edits).
     */
    public function store(Request $request)
    {
        $request->validate([
            'slides' => 'required|array|min:1',
            'slides.*' => 'required|string',
        ]);

        Setting::updateOrCreate(
            ['key' => 'hero_slideshow_images'],
            ['value' => json_encode(array_values($request->input('slides')))]
        );

        return redirect()->back()->with('success', 'Hero slideshow images saved successfully.');
    }

    /**
     * Remove an image from the slideshow by index.
     */
    public function destroy($index)
    {
        $setting = Setting::where('key', 'hero_slideshow_images')->first();
        $currentImages = [];
        if ($setting && !empty($setting->value)) {
            $decoded = json_decode($setting->value, true);
            if (is_array($decoded)) {
                $currentImages = $decoded;
            }
        }

        $idx = (int) $index;
        if (isset($currentImages[$idx])) {
            $removed = $currentImages[$idx];
            // Optionally delete file from storage if it is a local upload
            if (str_starts_with($removed, '/storage/slideshow/')) {
                $relativePath = str_replace('/storage/', '', $removed);
                Storage::disk('public')->delete($relativePath);
            }

            unset($currentImages[$idx]);
            $currentImages = array_values($currentImages);

            Setting::updateOrCreate(
                ['key' => 'hero_slideshow_images'],
                ['value' => json_encode($currentImages)]
            );

            return redirect()->back()->with('success', 'Slide image removed successfully.');
        }

        return redirect()->back()->with('error', 'Slide not found.');
    }

    /**
     * Reset slideshow images back to default high-res curated photos.
     */
    public function reset()
    {
        Setting::updateOrCreate(
            ['key' => 'hero_slideshow_images'],
            ['value' => json_encode($this->defaultImages)]
        );

        return redirect()->back()->with('success', 'Hero slideshow reset to default curated images.');
    }
}
