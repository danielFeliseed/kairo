<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Homework;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacher = Auth::user();
        $students = $teacher->students;
        $families = $teacher->managedFamilies;
        $recentHomework = Homework::whereIn('student_id', $students->pluck('id'))
            ->orderBy('homework_date', 'desc')
            ->limit(5)
            ->get();
        $recentHomework = $recentHomework->map(function ($homework) {
            $homework->studentName = $homework->student->name;
            $homework->homeworkDate = $homework->homework_date;
            return $homework;
        });
        return Inertia::render('TeacherDashboard', [
            'students' => $students,
            'recentHomework' => $recentHomework,
            'families' => $families,
        ]);
    }
}