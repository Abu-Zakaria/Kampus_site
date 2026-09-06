<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of all courses.
     */
    public function index()
    {
        $courses = Course::with('university')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show the form for creating a new course.
     */
    public function create()
    {
        $universities = University::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Courses/Form', [
            'course' => null,
            'universities' => $universities,
        ]);
    }

    /**
     * Store a newly created course in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'university_id' => 'required|exists:universities,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:courses,slug',
            'level' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'tuition_fee' => 'required|string|max:255',
            'show_tuition_fee' => 'nullable|boolean',
            'intake' => 'required|string|max:255',
        ]);

        $validated['show_tuition_fee'] = $request->boolean('show_tuition_fee', true);

        Course::create($validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course created successfully.');
    }

    /**
     * Show the form for editing the specified course.
     */
    public function edit($id)
    {
        $course = Course::findOrFail($id);
        $universities = University::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Courses/Form', [
            'course' => $course,
            'universities' => $universities,
        ]);
    }

    /**
     * Update the specified course in storage.
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'university_id' => 'required|exists:universities,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:courses,slug,' . $course->id,
            'level' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'tuition_fee' => 'required|string|max:255',
            'show_tuition_fee' => 'nullable|boolean',
            'intake' => 'required|string|max:255',
        ]);

        $validated['show_tuition_fee'] = $request->boolean('show_tuition_fee', true);

        $course->update($validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    /**
     * Toggle the visibility of the annual tuition fee for the specified course.
     */
    public function toggleTuitionFee(Course $course)
    {
        $course->update([
            'show_tuition_fee' => !$course->show_tuition_fee,
        ]);

        return back()->with('success', 'Annual tuition fee visibility updated successfully.');
    }

    /**
     * Remove the specified course from storage.
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
