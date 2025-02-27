<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Homework;
use App\Models\Streak;
use App\Models\User;
use App\Models\Feedback;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');
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
            return Inertia::render('TeacherDashboard', [
                'students' => $students,
                'recentHomework' => $recentHomework,
                'families' => $families,
            ]);
        } else {
            $streak = Streak::where('student_id', $user->id)->first();
            $latestHomework = Homework::where('student_id', $user->id)->latest()->first();
            $hasSubmittedToday = $latestHomework && $latestHomework->homework_date->format('Y-m-d') == $today;
            
            $student = User::with('teacher')->find($user->id);
            
            return Inertia::render('StudentDashboard', [
                'user' => $student,
                'currentStreak' => $user->streak?->getCurrentStreak() ?? 0,
                'longestStreak' => $user->streak?->getLongestStreak() ?? 0,
                'lastSubmission' => $user->streak?->getLastSubmission() ?? null,
                'currentStreakPercentage' => $user->streak?->getStreakPercentageAttribute() ?? 0,
                'latestHomework' => $latestHomework,
                'latestFeedback' => $latestHomework ? $latestHomework->getLatestFeedback() : null,
                'hasSubmittedToday' => $hasSubmittedToday,
            ]);
        }
    }
}