<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Homework;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacher = auth()->user();
        $students = $teacher->students;
        $families = $teacher->managedFamilies;
        $recentHomework = Homework::whereIn('student_id', $students->pluck('id'))
            ->orderBy('homework_date', 'desc')
            ->limit(5)
            ->get();
        return Inertia::render('TeacherDashboard', [
            'students' => $students,
            'recentHomework' => $recentHomework,
            'families' => $families,
        ]);
    }
}