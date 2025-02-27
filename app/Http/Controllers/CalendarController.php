<?php

namespace App\Http\Controllers;

use App\Models\Homework;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class CalendarController extends Controller
{
    public function index()
    {   
        $user = Auth::user();
        $student = User::find($user->id);
        $submissionDates = $student->homework->pluck('homework_date')->map(function($date) {
            return $date->format('Y-m-d');
        });

        return Inertia::render('Calendar', ['submissionDates' => $submissionDates]);
    }
}