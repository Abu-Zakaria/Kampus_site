<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\University;
use App\Models\Course;
use App\Models\Country;
use App\Models\Blog;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        // 1. Fetch Home Page CMS Record (SEO & Content)
        $page = Page::where('slug', 'home')->first();

        if (!$page) {
            $page = Page::create([
                'name' => 'Home',
                'slug' => 'home',
                'meta_title' => 'Kampus EduConsult — Study Abroad & University Placement',
                'meta_description' => 'Empowering ambitious students worldwide to gain admission into top global universities in UK, USA, Canada, Australia & Europe.',
                'meta_keywords' => 'study abroad, university admission, UKVI student visa, scholarship finder',
                'content' => [
                    'hero_heading' => 'Empowering your global education journey',
                    'hero_subtitle' => 'End-to-end guidance for university admission, scholarships, and student visas.',
                    'badge_text' => '',
                    'hero_image' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
                    'hero_overlay_opacity' => '75',
                    'stat_universities' => '500+',
                    'stat_acceptance' => '98%',
                    'stat_scholarships' => '$5M+'
                ],
                'is_active' => true
            ]);
        }

        // 2. Fetch Top Universities from Database
        $universities = University::withCount('courses')->take(4)->get();

        if ($universities->isEmpty()) {
            $defaultUniversities = [
                [
                    'name' => 'University of Oxford',
                    'slug' => 'university-of-oxford',
                    'location' => 'Oxford, United Kingdom',
                    'description' => 'The University of Oxford is a collegiate research university in Oxford, England.',
                    'cover_image' => 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80',
                    'features' => ['QS World Rank #1', 'High Employability', '100% Research Excellence']
                ],
                [
                    'name' => 'Harvard University',
                    'slug' => 'harvard-university',
                    'location' => 'Cambridge, Massachusetts, USA',
                    'description' => 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts.',
                    'cover_image' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
                    'features' => ['Ivy League Member', 'Top Business & Law', 'Need-Blind Aid']
                ],
                [
                    'name' => 'University of Helsinki',
                    'slug' => 'university-of-helsinki',
                    'location' => 'Helsinki, Finland',
                    'description' => 'The University of Helsinki is the oldest and largest institution of academic education in Finland.',
                    'cover_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
                    'features' => ['Top 1% Global Ranking', '50-100% Tuition Waivers', 'Work Permit']
                ],
                [
                    'name' => 'Middlesex University Dubai',
                    'slug' => 'middlesex-university-dubai',
                    'location' => 'Dubai Knowledge Park, UAE',
                    'description' => 'Middlesex University Dubai is the first overseas campus of Middlesex University London.',
                    'cover_image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
                    'logo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                    'features' => ['UK Degree in Dubai', 'No IELTS Option', 'Merit Scholarships']
                ]
            ];

            foreach ($defaultUniversities as $u) {
                University::create($u);
            }

            $universities = University::withCount('courses')->take(4)->get();
        }

        // 3. Fetch Top Courses from Database
        $courses = Course::with('university')->take(6)->get();

        if ($courses->isEmpty() && $universities->isNotEmpty()) {
            $oxford = $universities->firstWhere('slug', 'university-of-oxford') ?? $universities->first();
            $harvard = $universities->firstWhere('slug', 'harvard-university') ?? $universities->first();
            $helsinki = $universities->firstWhere('slug', 'university-of-helsinki') ?? $universities->first();

            $defaultCourses = [
                ['university_id' => $oxford->id, 'title' => 'MSc in Computer Science & AI', 'slug' => 'msc-computer-science-oxford', 'level' => 'Postgraduate', 'duration' => '1 Year Full-Time', 'tuition_fee' => '£32,500 / year', 'intake' => 'September 2026'],
                ['university_id' => $harvard->id, 'title' => 'Master of Business Administration (MBA)', 'slug' => 'mba-harvard', 'level' => 'Postgraduate', 'duration' => '2 Years Full-Time', 'tuition_fee' => '$74,000 / year', 'intake' => 'September 2026'],
                ['university_id' => $helsinki->id, 'title' => 'BSc in Data Science & Machine Learning', 'slug' => 'bsc-data-science-helsinki', 'level' => 'Undergraduate', 'duration' => '3 Years Full-Time', 'tuition_fee' => '€13,000 / year', 'intake' => 'January & Sept 2026'],
                ['university_id' => $oxford->id, 'title' => 'BA in Economics & Management', 'slug' => 'ba-economics-oxford', 'level' => 'Undergraduate', 'duration' => '3 Years Full-Time', 'tuition_fee' => '£29,500 / year', 'intake' => 'September 2026'],
                ['university_id' => $harvard->id, 'title' => 'Master of Public Health (MPH)', 'slug' => 'mph-harvard', 'level' => 'Postgraduate', 'duration' => '1 Year Full-Time', 'tuition_fee' => '$62,000 / year', 'intake' => 'September 2026'],
                ['university_id' => $helsinki->id, 'title' => 'MSc in Atmospheric Sciences & Climate', 'slug' => 'msc-climate-helsinki', 'level' => 'Postgraduate', 'duration' => '2 Years Full-Time', 'tuition_fee' => '€15,000 / year', 'intake' => 'September 2026'],
            ];

            foreach ($defaultCourses as $c) {
                Course::create($c);
            }

            $courses = Course::with('university')->take(6)->get();
        }

        // 4. Fetch Randomized Featured Destination Countries
        $defaultCountries = [
            [
                'name' => 'United Kingdom',
                'slug' => 'united-kingdom',
                'country_code' => 'GB',
                'subtitle' => '150+ Partner Universities',
                'image' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['Up to 3 Years Post-Study Work Visa', 'Scholarships up to £10,000'],
            ],
            [
                'name' => 'United States',
                'slug' => 'united-states',
                'country_code' => 'US',
                'subtitle' => '200+ Top Ranked Colleges',
                'image' => 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['3-Year STEM OPT Extension', 'Merit Aid & Assistantships'],
            ],
            [
                'name' => 'Finland',
                'slug' => 'finland',
                'country_code' => 'FI',
                'subtitle' => '98% Visa Success Rate',
                'image' => 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['PR Pathway After Graduation', '50-100% Tuition Waivers'],
            ],
            [
                'name' => 'United Arab Emirates',
                'slug' => 'united-arab-emirates',
                'country_code' => 'AE',
                'subtitle' => 'Global Tech & Business Hubs',
                'image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['100% Fast Student Visa', 'Tax-Free Career Opportunities'],
            ],
            [
                'name' => 'Canada',
                'slug' => 'canada',
                'country_code' => 'CA',
                'subtitle' => '3-Year PGWP & PR Pathways',
                'image' => 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['3-Year Post-Grad Work Permit', 'Express Entry PR Pathway'],
            ],
            [
                'name' => 'Australia',
                'slug' => 'australia',
                'country_code' => 'AU',
                'subtitle' => 'Top Group of Eight Unis',
                'image' => 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['Post-Study Work Rights', 'High Quality Life & Study'],
            ],
            [
                'name' => 'Germany',
                'slug' => 'germany',
                'country_code' => 'DE',
                'subtitle' => 'Zero/Low Tuition Fees',
                'image' => 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['Tuition-Free Public Unis', '18-Month Job Seeking Visa'],
            ],
            [
                'name' => 'Ireland',
                'slug' => 'ireland',
                'country_code' => 'IE',
                'subtitle' => 'Silicon Valley of Europe',
                'image' => 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&q=80&w=800',
                'is_featured' => true,
                'features' => ['2-Year Stay Back Option', 'European Tech Headquarters'],
            ],
        ];

        foreach ($defaultCountries as $dc) {
            Country::updateOrCreate(['slug' => $dc['slug']], $dc);
        }

        $countries = Country::where('is_featured', true)->inRandomOrder()->get();

        // 5. Fetch Featured Success Stories (Blogs)
        $successStories = Blog::where('is_published', true)->where('is_featured', true)->latest()->take(8)->get();

        if ($successStories->isEmpty()) {
            $defaultStories = [
                [
                    'title' => 'How Ayesha Secured a £10,000 Scholarship at University of Oxford',
                    'slug' => 'ayesha-oxford-scholarship-success',
                    'category' => 'Success Stories',
                    'excerpt' => 'From initial SOP review to the final visa interview, discover the step-by-step roadmap that helped Ayesha win a prestigious merit scholarship.',
                    'content' => 'Full inspiring journey of Ayesha getting into Oxford MSc Data Science with a full scholarship grant and tier-4 visa on the first attempt.',
                    'image' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
                    'is_published' => true,
                    'is_featured' => true,
                ],
                [
                    'title' => 'From Dhaka to Harvard: Tanvir’s Full-Ride MBA Acceptance Story',
                    'slug' => 'tanvir-harvard-mba-journey',
                    'category' => 'Success Stories',
                    'excerpt' => 'Read how Tanvir cracked the GMAT 740 and crafted standout leadership essays with our certified Ivy League admissions counselors.',
                    'content' => 'Tanvir shares his application insights, reference letter tactics, and mock interview preparations for Harvard Business School.',
                    'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                    'is_published' => true,
                    'is_featured' => true,
                ],
                [
                    'title' => '100% Tuition Waiver in Finland: Farhan’s Tech Degree Pathway',
                    'slug' => 'farhan-finland-tuition-waiver',
                    'category' => 'Success Stories',
                    'excerpt' => 'How Farhan landed a 100% tuition waiver at University of Helsinki and brought his family on a residence permit seamlessly.',
                    'content' => 'Finland offers incredible career benefits and family PR paths. Here is how Farhan prepared his portfolio and motivational video.',
                    'image' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
                    'is_published' => true,
                    'is_featured' => true,
                ],
                [
                    'title' => 'Fast-Track Dubai Tech Career: Sarah’s Global University Journey',
                    'slug' => 'sarah-dubai-tech-career-journey',
                    'category' => 'Success Stories',
                    'excerpt' => 'Sarah received her unconditional offer and student visa in just 7 days to study AI in Dubai with zero income tax prospects.',
                    'content' => 'Comprehensive interview with Sarah discussing her internship placements and fast-track student visa experience with Kampus EduConsult.',
                    'image' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                    'is_published' => true,
                    'is_featured' => true,
                ],
            ];

            foreach ($defaultStories as $ds) {
                Blog::updateOrCreate(['slug' => $ds['slug']], $ds);
            }

            $successStories = Blog::where('is_published', true)->where('is_featured', true)->latest()->take(8)->get();
        }

        // 6. Fetch Dynamic FAQs from Database (with default seeding if empty)
        $faqs = Faq::where('is_active', true)->orderBy('sort_order', 'asc')->get();

        if ($faqs->isEmpty()) {
            $defaultFaqs = [
                [
                    'question' => 'Where can I study?',
                    'answer' => 'We partner with over 500+ top-ranked universities across the UK, USA, Canada, Australia, Finland, and Dubai (UAE). Our senior education counselors analyze your academic background, budget, and career goals to shortlist the ideal target destinations.',
                    'sort_order' => 1,
                    'is_active' => true,
                ],
                [
                    'question' => 'Can I get a scholarship?',
                    'answer' => 'Yes! Most of our partner universities offer merit-based scholarships, country-specific grants, and tuition fee waivers ranging from £2,000 up to 100% full tuition coverage. We guide you through writing compelling personal statements and scholarship applications.',
                    'sort_order' => 2,
                    'is_active' => true,
                ],
                [
                    'question' => 'How much does it cost to live in the UK?',
                    'answer' => 'According to UKVI student visa guidelines, living costs in the UK are estimated at approximately £9,207 per academic year (outside London) and £12,006 per academic year (inside London). This budget covers accommodation, food, utilities, and daily travel.',
                    'sort_order' => 3,
                    'is_active' => true,
                ],
                [
                    'question' => 'Are Kampus consultancy services really 100% free?',
                    'answer' => 'Yes, 100%! Our counseling, university application processing, document review, and visa guidance services are completely free for students. We are officially contracted and funded directly by our partner universities globally.',
                    'sort_order' => 4,
                    'is_active' => true,
                ],
                [
                    'question' => 'What are the English language test requirements?',
                    'answer' => 'Universities accept IELTS (typically 6.0 – 7.0 overall), TOEFL iBT, PTE Academic, or Duolingo English Tests. Additionally, several UK and European universities offer IELTS waivers based on high school or undergraduate Medium of Instruction (MOI) certificates.',
                    'sort_order' => 5,
                    'is_active' => true,
                ],
                [
                    'question' => 'How long does it take to get a university offer letter?',
                    'answer' => 'Conditional offer letters are usually issued within 48 hours to 2 weeks, depending on the university and course selection. Our fast-track application system ensures your application is processed with priority.',
                    'sort_order' => 6,
                    'is_active' => true,
                ],
            ];

            foreach ($defaultFaqs as $df) {
                Faq::create($df);
            }

            $faqs = Faq::where('is_active', true)->orderBy('sort_order', 'asc')->get();
        }

        return Inertia::render('Home', [
            'page' => $page,
            'universities' => $universities,
            'totalUniversitiesCount' => University::count(),
            'courses' => $courses,
            'countries' => $countries,
            'totalCountriesCount' => Country::count(),
            'successStories' => $successStories,
            'faqs' => $faqs,
        ]);
    }
}
