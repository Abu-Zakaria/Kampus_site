<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
            'partner_modal_paragraph' => 'Join our global higher education network. Register your agency below to collaborate with top universities worldwide and streamline student admissions.',
            'facebook_url' => 'https://facebook.com/kampusedu',
            'linkedin_url' => 'https://linkedin.com/company/kampusedu',
            'instagram_url' => 'https://instagram.com/kampusedu',
            'youtube_url' => 'https://youtube.com/c/kampusedu',
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
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
