<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display global site settings.
     */
    public function index()
    {
        // Seed default key-values if not present
        $defaults = [
            'site_name' => 'Kampus Edu',
            'header_subtitle' => 'Educational Consultancy',
            'site_tagline' => 'Global Higher Education Advisers',
            'footer_name' => 'Kampus EduConsult',
            'footer_subtitle' => 'Global Higher Education Advisers',
            'footer_description' => 'Empowering ambitious students worldwide to access top-tier university education with bespoke admissions counselling, visa support, and scholarship guidance.',
            'head_office_address' => "124 Education Avenue, Suite 400, Oxford Street\nLondon W1B 3AG, United Kingdom",
            'head_office_phone' => "UK: +44 20 7946 0912 | BD: +880 1812713814",
            'contact_email' => 'apply@kampusedu.com',
            'contact_bd_hotline' => '+880 1812713814',
            'operating_hours' => 'Mon - Sat: 9:00 AM - 7:00 PM',
            'facebook_url' => 'https://facebook.com/kampusedu',
            'linkedin_url' => 'https://linkedin.com/company/kampusedu',
            'instagram_url' => 'https://instagram.com/kampusedu',
            'youtube_url' => 'https://youtube.com/c/kampusedu',
            // Contact Page Details & Map Embed
            'contact_info_title' => 'Contact Information',
            'contact_info_subtitle' => 'London Global HQ & Regional Advisory Center',
            'contact_info_address' => '1st Floor, Botanical Works, 2 Jubilee Street, London E1 3FU',
            'contact_info_email' => 'info@kampus-group.com',
            'contact_info_phone' => '020 7423 9333',
            'contact_info_hours' => 'Monday - Friday: 9:00 AM - 6:00 PM GMT',
            'contact_map_iframe' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.915783307521!2d-0.05716182337775242!3d51.51478190950346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876033580555555%3A0x123456789abcdef!2sJubilee%20St%2C%20London!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk',
            // Hero 3D Card Slideshow Images
            'hero_slideshow_images' => json_encode([
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
            ]),
        ];

        foreach ($defaults as $key => $value) {
            if (!Setting::where('key', $key)->exists()) {
                Setting::create(['key' => $key, 'value' => $value]);
            }
        }

        // Pluck key-value array format e.g. ['site_name' => 'Kampus Edu', ...]
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Store or update global site settings and file uploads in storage.
     */
    public function store(Request $request)
    {
        // Handle explicit removal of home hero banner image
        if ($request->boolean('remove_home_hero_image') || $request->input('remove_home_hero_image') == '1' || $request->input('remove_home_hero_image') === true) {
            Setting::updateOrCreate(['key' => 'home_hero_image'], ['value' => '']);
            $this->syncHomePageHeroImage(null);

            return redirect()->route('admin.settings.index')
                ->with('success', 'Hero banner image removed successfully.');
        }

        foreach ($request->except(['_token', '_method']) as $key => $value) {
            if ($request->hasFile($key)) {
                $path = $request->file($key)->store('settings', 'public');
                Setting::updateOrCreate(['key' => $key], ['value' => $path]);

                if ($key === 'home_hero_image') {
                    $this->syncHomePageHeroImage('/storage/' . $path);
                }
            } elseif ($value !== null) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => is_array($value) ? json_encode($value) : $value]
                );

                if ($key === 'home_hero_image') {
                    if (is_string($value) && trim($value) !== '') {
                        $imgUrl = (str_starts_with($value, 'http') || str_starts_with($value, '/')) ? $value : ('/storage/' . $value);
                        $this->syncHomePageHeroImage($imgUrl);
                    } else {
                        $this->syncHomePageHeroImage(null);
                    }
                }
            }
        }

        return redirect()->route('admin.settings.index')
            ->with('success', 'Global brand and site settings updated successfully.');
    }

    /**
     * Synchronize hero image with Home Page CMS record.
     */
    protected function syncHomePageHeroImage(?string $url): void
    {
        $homePage = Page::where('slug', 'home')->first();
        if ($homePage) {
            $content = $homePage->content ?? [];
            $content['hero_image'] = $url ?: null;
            if (!isset($content['hero']) || !is_array($content['hero'])) {
                $content['hero'] = [];
            }
            $content['hero']['image'] = $url ?: null;
            $homePage->update(['content' => $content]);
        }
    }

    /**
     * Alias for store method.
     */
    public function update(Request $request)
    {
        return $this->store($request);
    }
}
