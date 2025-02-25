<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Homework;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'teacher') {
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
            return Inertia::render('Dashboard', [
                'students' => $students,
                'recentHomework' => $recentHomework,
                'families' => $families,
            ]);
        } else {
            return Inertia::render('Dashboard', [
                'user' => $user,
            ]);
        }
    }
}