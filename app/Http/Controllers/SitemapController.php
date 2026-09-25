<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\Course;
use App\Models\Blog;

class SitemapController extends Controller
{
    public function index()
    {
        $universities = University::select('slug', 'updated_at')->latest('updated_at')->get();
        $courses = Course::select('slug', 'updated_at')->latest('updated_at')->get();
        $blogs = Blog::where('is_published', true)->select('slug', 'updated_at')->latest('updated_at')->get();

        return response()->view('sitemap', [
            'universities' => $universities,
            'courses' => $courses,
            'blogs' => $blogs,
        ])->header('Content-Type', 'text/xml');
    }
}
