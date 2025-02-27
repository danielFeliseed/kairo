<?php

namespace App\Http\Controllers;

use App\Models\Homework;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Streak;
class CalendarController extends Controller
{
    public function index()
    {   
        $user = Auth::user();
        $student = User::find($user->id);
        $streak = Streak::where('student_id', $user->id)->first();

        $submissionDates = $student->homework->pluck('homework_date')->map(function($date) {
            return $date->format('Y-m-d');
        });

        return Inertia::render('Calendar', ['submissionDates' => $submissionDates, 'currentStreak' => $streak->getCurrentStreak(), 'longestStreak' => $streak->getLongestStreak()]);
    }
}