<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultPages = [
            [
                'name' => 'Home',
                'slug' => 'home',
                'meta_title' => 'Kampus EduConsult — Study Abroad & University Placement',
                'meta_description' => 'Empowering ambitious students worldwide to gain admission into top global universities in UK, USA, Canada, Australia & Europe.',
                'meta_keywords' => 'study abroad, university admission, UKVI student visa, scholarship finder',
                'content' => [
                    'hero_heading' => 'Empowering your global education journey',
                    'hero_subtitle' => 'End-to-end guidance for university admission, scholarships, and student visas.',
                    'badge_text' => 'OFFICIAL BRITISH COUNCIL & ICEF PARTNER',
                    'hero_image' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
                    'hero_overlay_opacity' => '75',
                    'stat_universities' => '500+',
                    'stat_acceptance' => '98%',
                    'stat_scholarships' => '$5M+'
                ],
                'is_active' => true
            ],
            [
                'name' => 'About Us',
                'slug' => 'about',
                'meta_title' => 'About Us — Kampus Group',
                'meta_description' => 'Learn about our mission, British Council & ICEF accreditation, global team of education advisers, and student-first commitment.',
                'meta_keywords' => 'about kampus group, British council agent, ICEF agency, global advisers',
                'content' => [
                    'hero_heading' => 'Your trusted global education partners',
                    'hero_subtitle' => 'Building futures with integrity, transparent guidance, and personalized counseling.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Services',
                'slug' => 'services',
                'meta_title' => 'Our Services — Kampus Group',
                'meta_description' => 'Comprehensive student services: university placement, scholarship guidance, bank financial proof assistance, SOP review & visa file processing.',
                'meta_keywords' => 'student services, visa assistance, SOP review, financial proof, university application',
                'content' => [
                    'hero_heading' => 'Comprehensive Higher Education Support',
                    'hero_subtitle' => 'Explore how our counselors guide you from initial profile evaluation to campus arrival.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Universities',
                'slug' => 'universities',
                'meta_title' => 'Partner Universities — Kampus Group',
                'meta_description' => 'Browse over 500+ top-ranked partner universities across the UK, USA, Canada, Australia, Finland, and Dubai.',
                'meta_keywords' => 'partner universities, UK universities, US Ivy League, Finland degrees, Dubai campuses',
                'content' => [
                    'hero_heading' => 'Discover Top Global Universities',
                    'hero_subtitle' => 'Filter by country, QS world ranking, and annual tuition fee budget.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Courses',
                'slug' => 'courses',
                'meta_title' => 'Degree & Course Finder — Kampus Group',
                'meta_description' => 'Search thousands of undergraduate and postgraduate degrees in Artificial Intelligence, Business, Data Science, Law & Engineering.',
                'meta_keywords' => 'course finder, Masters in UK, BSc Data Science, MBA USA, undergraduate degrees',
                'content' => [
                    'hero_heading' => 'Find the right course for your future',
                    'hero_subtitle' => 'Explore degrees across AI, Business, Law, Medicine & Engineering.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Blog',
                'slug' => 'blog',
                'meta_title' => 'Latest Articles & Education News — Kampus Group',
                'meta_description' => 'Stay updated with international student visa policy updates, UKVI rules, scholarship deadlines, and campus life guides.',
                'meta_keywords' => 'study abroad blog, UKVI updates 2026, scholarship tips, student visa guide',
                'content' => [
                    'hero_heading' => 'Insights & Study Abroad News',
                    'hero_subtitle' => 'Expert articles on visa policies, admission strategies, and international student life.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Contact Us',
                'slug' => 'contact',
                'meta_title' => 'Contact Us — Kampus Group',
                'meta_description' => 'Get in touch with our global offices in London, Dhaka, and worldwide for free 1-on-1 higher education counseling.',
                'meta_keywords' => 'contact kampus, education counselor London, Dhaka office, book appointment',
                'content' => [
                    'hero_heading' => 'Get in touch with our experts',
                    'hero_subtitle' => 'Book a free 1-on-1 counseling call or visit our global branches today.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Partner With Us',
                'slug' => 'partner-with-us',
                'meta_title' => 'Partner With Us — Kampus Group',
                'meta_description' => 'Become an official sub-agent or institutional partner with Kampus Educational Consultancy Ltd. Enjoy attractive commissions and dedicated support.',
                'meta_keywords' => 'become partner, education agent partner, sub-agent program, university partner',
                'content' => [
                    'hero_heading' => 'Grow with Kampus Group',
                    'hero_subtitle' => 'Join our global partner network and empower students with top-tier university admissions.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Scholarships',
                'slug' => 'scholarships',
                'meta_title' => 'Scholarships & Funding — Kampus Group',
                'meta_description' => 'Explore UK GREAT, Chevening, Fulbright, and Finland government tuition waivers to make your study abroad journey affordable.',
                'meta_keywords' => 'UK GREAT scholarship, Fulbright award, Finland tuition waiver, merit scholarships',
                'content' => [
                    'hero_heading' => 'Fund your global future',
                    'hero_subtitle' => 'Merit-based, need-based, and country-specific scholarships to make study abroad affordable.'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Visa Guide',
                'slug' => 'visa-guide',
                'meta_title' => 'Student Visa Processing & Guide — Kampus Group',
                'meta_description' => 'Step-by-step guidance for UKVI Tier 4, US F-1, Finland residence permits, and Dubai student visas with document checklists.',
                'meta_keywords' => 'UKVI visa guide, US F-1 checklist, Finland residence permit, Dubai student visa',
                'content' => [
                    'hero_heading' => 'Stress-free visa processing',
                    'hero_subtitle' => 'Step-by-step guidance for your UKVI, US F-1, and other student visas with certified advisers.'
                ],
                'is_active' => true
            ]
        ];

        foreach ($defaultPages as $pageData) {
            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }
    }
}
