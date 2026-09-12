<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\PublicDestinationController;
use App\Http\Controllers\PublicUniversityController;
use App\Http\Controllers\PublicCourseController;
use App\Http\Controllers\PublicBlogController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\PublicServiceController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\UniversityController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\EnvSettingController;
use App\Http\Controllers\Admin\HeroSlideshowController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\StudentApplicationController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use Illuminate\Http\Request;

// Public Dynamic Home Route (Using original HomeController)
Route::get('/', HomeController::class)->name('home');

Route::get('/about', function () {
    $page = \App\Models\Page::where('slug', 'about')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }

    $employees = \App\Models\Employee::where('is_active', true)
        ->orderBy('sort_order', 'asc')
        ->orderBy('id', 'asc')
        ->get();

    $companyStats = [
        'employee_count' => \App\Models\Setting::where('key', 'company_employee_count')->value('value') ?: ($employees->count() . '+ Global Team Members'),
        'employee_stat_subtext' => \App\Models\Setting::where('key', 'company_employee_stat_subtext')->value('value') ?: 'Dedicated education consultants, visa case officers, and support staff across 15+ countries worldwide.',
        'team_heading' => \App\Models\Setting::where('key', 'company_team_heading')->value('value') ?: 'Meet our global education leadership',
        'team_subheading' => \App\Models\Setting::where('key', 'company_team_subheading')->value('value') ?: 'Driven by ethics, academic expertise, and student success, our multi-disciplinary team brings decades of university admissions experience.',
    ];

    return Inertia::render('About', [
        'page' => $page,
        'employees' => $employees,
        'companyStats' => $companyStats,
    ]); 
})->name('about');

Route::get('/services', [PublicServiceController::class, 'index'])->name('services.index');

Route::get('/universities', [PublicUniversityController::class, 'index'])->name('universities.index');

Route::get('/destinations/{slug}', [PublicDestinationController::class, 'show'])->name('destinations.show');
Route::get('/universities/{slug}', [PublicUniversityController::class, 'show'])->name('universities.show');

Route::get('/blog', [PublicBlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [PublicBlogController::class, 'show'])->name('blog.show');

Route::get('/contact', function () {
    $page = \App\Models\Page::where('slug', 'contact')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('Contact', ['page' => $page]); 
})->name('contact');

Route::get('/courses', [PublicCourseController::class, 'index'])->name('courses.index');

Route::get('/partner', function () {
    return redirect()->route('partner-with-us');
});

Route::get('/partner-with-us', function () {
    $page = \App\Models\Page::where('slug', 'partner-with-us')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('PartnerWithUs', ['page' => $page]); 
})->name('partner-with-us');

Route::get('/scholarships', function () {
    $page = \App\Models\Page::where('slug', 'scholarships')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('Scholarships', ['page' => $page]); 
})->name('scholarships');

Route::get('/visa-guide', function () {
    $page = \App\Models\Page::where('slug', 'visa-guide')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('VisaGuide', ['page' => $page]); 
})->name('visa-guide');

Route::get('/privacy-policy', function () {
    $page = \App\Models\Page::where('slug', 'privacy-policy')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('PrivacyPolicy', ['page' => $page]); 
})->name('privacy-policy');

Route::get('/terms-of-service', function () {
    $page = \App\Models\Page::where('slug', 'terms-of-service')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('TermsOfService', ['page' => $page]); 
})->name('terms-of-service');

Route::get('/terms', function () {
    return redirect()->route('terms-of-service');
});

Route::get('/cookie-preferences', function () {
    $page = \App\Models\Page::where('slug', 'cookie-preferences')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('CookiePreferences', ['page' => $page]); 
})->name('cookie-preferences');

Route::get('/accreditation', function () {
    $page = \App\Models\Page::where('slug', 'accreditation')->first();
    if ($page && !$page->is_active && !auth()->check()) {
        abort(404);
    }
    return Inertia::render('Accreditation', ['page' => $page]); 
})->name('accreditation');

// Public Partner Application, Contact & Call Booking Submission Routes
Route::post('/partner/apply', [PartnerController::class, 'store'])->name('partner.apply');
Route::post('/contact/submit', [InquiryController::class, 'store'])->name('contact.submit');
Route::post('/book-call', [FrontendController::class, 'bookCall'])->name('book-call.submit');
Route::post('/course-enquiry', [FrontendController::class, 'enquireCourse'])->name('course.enquiry');

// AI Course Matcher API Routes
Route::post('/api/course-matcher', [FrontendController::class, 'matchCourses'])->name('api.course-matcher');
Route::post('/api/course-matcher-lead', [FrontendController::class, 'saveMatcherLead'])->name('api.course-matcher-lead');

// Global Index Search API (Laravel Scout)
Route::get('/api/global-search', [SearchController::class, 'search'])->name('api.global-search');

// General Dashboard Redirect Route (Smart redirect based on user role)
Route::get('/dashboard', function (Request $request) {
    if ($request->user()->isStudent()) {
        return redirect()->route('student.dashboard');
    }
    return redirect()->route('admin.dashboard');
})->middleware(['auth'])->name('dashboard');

// Student Portal & Dashboard Routes
Route::middleware(['auth'])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
    Route::post('/applications/apply', [StudentDashboardController::class, 'apply'])->name('student.applications.apply');
    Route::post('/messages', [\App\Http\Controllers\Student\StudentMessageController::class, 'store'])->name('student.messages.store');
    Route::post('/messages/{id}/reply', [\App\Http\Controllers\Student\StudentMessageController::class, 'reply'])->name('student.messages.reply');
    Route::post('/messages/{id}/read', [\App\Http\Controllers\Student\StudentMessageController::class, 'markAsRead'])->name('student.messages.read');

    // Student Profile, Certificates & Achievements Routes
    Route::put('/profile', [\App\Http\Controllers\Student\StudentProfileController::class, 'updateProfile'])->name('student.profile.update');
    Route::post('/certificates', [\App\Http\Controllers\Student\StudentProfileController::class, 'storeCertificate'])->name('student.certificates.store');
    Route::post('/certificates/{id}', [\App\Http\Controllers\Student\StudentProfileController::class, 'updateCertificate'])->name('student.certificates.update');
    Route::delete('/certificates/{id}', [\App\Http\Controllers\Student\StudentProfileController::class, 'destroyCertificate'])->name('student.certificates.destroy');
    Route::post('/achievements', [\App\Http\Controllers\Student\StudentProfileController::class, 'storeAchievement'])->name('student.achievements.store');
    Route::post('/achievements/{id}', [\App\Http\Controllers\Student\StudentProfileController::class, 'updateAchievement'])->name('student.achievements.update');
    Route::delete('/achievements/{id}', [\App\Http\Controllers\Student\StudentProfileController::class, 'destroyAchievement'])->name('student.achievements.destroy');
});

// SECURED ADMIN CMS ROUTES (Protected by 'auth' and 'EnsurePartnerPasswordSet' middleware)
Route::middleware(['auth', \App\Http\Middleware\EnsurePartnerPasswordSet::class])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('/notifications/mark-read', [AdminDashboardController::class, 'markNotificationsRead'])->name('admin.notifications.mark-read');

    // Student Directory & Portfolio Review Routes
    Route::middleware('can:manage-inquiries')->group(function () {
        Route::get('/students', [\App\Http\Controllers\Admin\StudentController::class, 'index'])->name('admin.students.index');
        Route::get('/students/{id}', [\App\Http\Controllers\Admin\StudentController::class, 'show'])->name('admin.students.show');
        Route::patch('/students/certificates/{id}/verify', [\App\Http\Controllers\Admin\StudentController::class, 'verifyCertificate'])->name('admin.students.certificates.verify');
        Route::patch('/students/achievements/{id}/verify', [\App\Http\Controllers\Admin\StudentController::class, 'verifyAchievement'])->name('admin.students.achievements.verify');
    });

    // Global Settings Routes
    Route::middleware('can:manage-settings')->group(function () {
        Route::get('/settings', [SettingController::class, 'index'])->name('admin.settings.index');
        Route::post('/settings', [SettingController::class, 'store'])->name('admin.settings.store');
        Route::post('/settings/update', [SettingController::class, 'store'])->name('admin.settings.update');

        // Environment (.env) Settings Routes
        Route::get('/settings/env', [EnvSettingController::class, 'index'])->name('admin.settings.env.index');
        Route::post('/settings/env', [EnvSettingController::class, 'update'])->name('admin.settings.env.update');
        Route::post('/settings/env/test-email', [EnvSettingController::class, 'testEmail'])->name('admin.settings.env.test-email');

        // Dedicated Hero Slideshow Management Routes
        Route::get('/slideshow', [HeroSlideshowController::class, 'index'])->name('admin.slideshow.index');
        Route::post('/slideshow', [HeroSlideshowController::class, 'store'])->name('admin.slideshow.store');
        Route::post('/slideshow/upload', [HeroSlideshowController::class, 'upload'])->name('admin.slideshow.upload');
        Route::post('/slideshow/{index}/replace', [HeroSlideshowController::class, 'replace'])->name('admin.slideshow.replace');
        Route::delete('/slideshow/{index}', [HeroSlideshowController::class, 'destroy'])->name('admin.slideshow.destroy');
        Route::post('/slideshow/reset', [HeroSlideshowController::class, 'reset'])->name('admin.slideshow.reset');
    });

    // Pages & SEO Routes
    Route::middleware('can:manage-pages')->group(function () {
        Route::get('/pages', [PageController::class, 'index'])->name('admin.pages.index');
        Route::get('/pages/create', [PageController::class, 'create'])->name('admin.pages.create');
        Route::post('/pages', [PageController::class, 'store'])->name('admin.pages.store');
        Route::post('/pages/upload-image', [PageController::class, 'uploadImage'])->name('admin.pages.upload-image');
        Route::get('/pages/{id}/edit', [PageController::class, 'edit'])->name('admin.pages.edit');
        Route::put('/pages/{id}', [PageController::class, 'update'])->name('admin.pages.update');
        Route::delete('/pages/{id}', [PageController::class, 'destroy'])->name('admin.pages.destroy');

        // FAQs CRUD Routes
        Route::resource('faqs', FaqController::class)->names([
            'index' => 'admin.faqs.index',
            'create' => 'admin.faqs.create',
            'store' => 'admin.faqs.store',
            'edit' => 'admin.faqs.edit',
            'update' => 'admin.faqs.update',
            'destroy' => 'admin.faqs.destroy',
        ]);
        Route::patch('/faqs/{faq}/toggle-status', [FaqController::class, 'toggleStatus'])->name('admin.faqs.toggle-status');

        // Global Branches CRUD Routes
        Route::resource('branches', BranchController::class)->names([
            'index' => 'admin.branches.index',
            'create' => 'admin.branches.create',
            'store' => 'admin.branches.store',
            'edit' => 'admin.branches.edit',
            'update' => 'admin.branches.update',
            'destroy' => 'admin.branches.destroy',
        ]);
        Route::patch('/branches/{branch}/toggle-status', [BranchController::class, 'toggleStatus'])->name('admin.branches.toggle-status');

        // Employees & Company Team CRUD Routes
        Route::post('/employees/settings', [EmployeeController::class, 'updateSettings'])->name('admin.employees.settings');
        Route::patch('/employees/{employee}/toggle-status', [EmployeeController::class, 'toggleStatus'])->name('admin.employees.toggle-status');
        Route::resource('employees', EmployeeController::class)->names([
            'index' => 'admin.employees.index',
            'create' => 'admin.employees.create',
            'store' => 'admin.employees.store',
            'edit' => 'admin.employees.edit',
            'update' => 'admin.employees.update',
            'destroy' => 'admin.employees.destroy',
        ]);
    });

    // Countries CRUD Routes
    Route::get('/countries/sample-excel', [CountryController::class, 'downloadSample'])
        ->middleware('can:manage-countries')
        ->name('admin.countries.sample-excel');
    Route::post('/countries/bulk-upload', [CountryController::class, 'bulkUpload'])
        ->middleware('can:manage-countries')
        ->name('admin.countries.bulk-upload');
    Route::resource('countries', CountryController::class)->middleware('can:manage-countries')->names([
        'index' => 'admin.countries.index',
        'create' => 'admin.countries.create',
        'store' => 'admin.countries.store',
        'edit' => 'admin.countries.edit',
        'update' => 'admin.countries.update',
        'destroy' => 'admin.countries.destroy',
    ]);

    // Universities CRUD Routes
    Route::get('/universities/sample-excel', [UniversityController::class, 'downloadSample'])
        ->middleware('can:manage-universities')
        ->name('admin.universities.sample-excel');
    Route::post('/universities/bulk-upload', [UniversityController::class, 'bulkUpload'])
        ->middleware('can:manage-universities')
        ->name('admin.universities.bulk-upload');
    Route::resource('universities', UniversityController::class)->middleware('can:manage-universities')->names([
        'index' => 'admin.universities.index',
        'create' => 'admin.universities.create',
        'store' => 'admin.universities.store',
        'edit' => 'admin.universities.edit',
        'update' => 'admin.universities.update',
        'destroy' => 'admin.universities.destroy',
    ]);

    // Courses CRUD Routes
    Route::get('/courses/sample-excel', [CourseController::class, 'downloadSample'])
        ->middleware('can:manage-courses')
        ->name('admin.courses.sample-excel');
    Route::post('/courses/bulk-upload', [CourseController::class, 'bulkUpload'])
        ->middleware('can:manage-courses')
        ->name('admin.courses.bulk-upload');
    Route::resource('courses', CourseController::class)->middleware('can:manage-courses')->names([
        'index' => 'admin.courses.index',
        'create' => 'admin.courses.create',
        'store' => 'admin.courses.store',
        'edit' => 'admin.courses.edit',
        'update' => 'admin.courses.update',
        'destroy' => 'admin.courses.destroy',
    ]);
    Route::patch('/courses/{course}/toggle-fee', [CourseController::class, 'toggleTuitionFee'])
        ->middleware('can:manage-courses')
        ->name('admin.courses.toggle-fee');

    // Blog Posts CRUD Routes
    Route::middleware('can:manage-blogs')->group(function () {
        Route::resource('blog', BlogController::class)->names([
            'index' => 'admin.blog.index',
            'create' => 'admin.blog.create',
            'store' => 'admin.blog.store',
            'edit' => 'admin.blog.edit',
            'update' => 'admin.blog.update',
            'destroy' => 'admin.blog.destroy',
        ]);
        Route::patch('/blogs/{blog}/toggle-featured', [BlogController::class, 'toggleFeatured'])->name('admin.blogs.toggle-featured');
    });
    // Services CRUD Routes
    Route::middleware('can:manage-pages')->group(function () {
        Route::resource('services', ServiceController::class)->names([
            'index' => 'admin.services.index',
            'create' => 'admin.services.create',
            'store' => 'admin.services.store',
            'edit' => 'admin.services.edit',
            'update' => 'admin.services.update',
            'destroy' => 'admin.services.destroy',
        ]);
        Route::patch('/services/{service}/toggle-status', [ServiceController::class, 'toggleStatus'])->name('admin.services.toggle-status');
    });

    // Partner Applications Routes (admin management)
    Route::middleware('can:manage-partners')->group(function () {
        Route::post('/partners/popup-paragraph', [PartnerController::class, 'updatePopupParagraph'])->name('admin.partners.update-popup-paragraph');
        Route::resource('partners', PartnerController::class)->only(['index', 'update', 'destroy'])->names([
            'index' => 'admin.partners.index',
            'update' => 'admin.partners.update',
            'destroy' => 'admin.partners.destroy',
        ]);
    });

    // Inquiries & Contact Messages Routes (admin management)
    Route::resource('inquiries', InquiryController::class)->middleware('can:manage-inquiries')->only(['index', 'update', 'destroy'])->names([
        'index' => 'admin.inquiries.index',
        'update' => 'admin.inquiries.update',
        'destroy' => 'admin.inquiries.destroy',
    ]);
    Route::post('inquiries/{id}/reply', [InquiryController::class, 'reply'])
        ->middleware('can:manage-inquiries')
        ->name('admin.inquiries.reply');

    // Student Admission Applications Management Routes (admin management)
    Route::get('student-applications', [StudentApplicationController::class, 'index'])
        ->middleware('can:manage-inquiries')
        ->name('admin.student-applications.index');
    Route::put('student-applications/{id}/status', [StudentApplicationController::class, 'updateStatus'])
        ->middleware('can:manage-inquiries')
        ->name('admin.student-applications.update-status');
    Route::delete('student-applications/{id}', [StudentApplicationController::class, 'destroy'])
        ->middleware('can:manage-inquiries')
        ->name('admin.student-applications.destroy');

    // Student Messages Workstation Routes (admin management)
    Route::middleware('can:manage-inquiries')->group(function () {
        Route::get('messages', [\App\Http\Controllers\Admin\StudentMessageController::class, 'index'])->name('admin.messages.index');
        Route::post('messages', [\App\Http\Controllers\Admin\StudentMessageController::class, 'store'])->name('admin.messages.store');
        Route::post('messages/{id}/reply', [\App\Http\Controllers\Admin\StudentMessageController::class, 'reply'])->name('admin.messages.reply');
        Route::patch('messages/{id}/toggle-status', [\App\Http\Controllers\Admin\StudentMessageController::class, 'toggleStatus'])->name('admin.messages.toggle-status');
        Route::delete('messages/{id}', [\App\Http\Controllers\Admin\StudentMessageController::class, 'destroy'])->name('admin.messages.destroy');
    });

    // Roles & Permissions Management Routes
    Route::resource('roles', RoleController::class)->middleware('can:manage-roles')->except(['create', 'show', 'edit'])->names([
        'index' => 'admin.roles.index',
        'store' => 'admin.roles.store',
        'update' => 'admin.roles.update',
        'destroy' => 'admin.roles.destroy',
    ]);

    // User Management Routes
    Route::resource('users', UserController::class)->middleware('can:manage-users')->only(['index', 'update', 'destroy'])->names([
        'index' => 'admin.users.index',
        'update' => 'admin.users.update',
        'destroy' => 'admin.users.destroy',
    ]);

    // Profile Settings Route (Inside Admin)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
});

// Profile Management Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Include Breeze Auth Routes (login, register, logout, password.request)
require __DIR__.'/auth.php';

// Dynamic Catch-All Public Page Route (Placed at the VERY END)
Route::get('/{slug}', [PublicPageController::class, 'show'])->name('pages.show');
