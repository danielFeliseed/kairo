<?php

namespace App\Http\Controllers;

use App\Models\Homework;
use App\Models\Streak;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
class HomeworkController extends Controller
{
    public function index()
    {
        $homework = Homework::with(['student', 'feedback'])
            ->orderBy('homework_date', 'desc')
            ->get();
        return Inertia::render('Homework/Index', [
            'homework' => $homework,
        ]);
    }

    // In HomeworkController.php
public function store(Request $request)
{
    $request->validate([
        'image' => 'required|image|max:10240', // 10MB max
    ]);

    // Create a new homework entry
    $homework = Homework::create([
        'student_id' => auth()->id(),
        'homework_date' => now()->format('Y-m-d'),
        'status' => 'submitted',
    ]);
    
    // Add the image to the homework using Spatie Media Library
    if ($request->hasFile('image')) {
        $homework->addMediaFromRequest('image')
            ->toMediaCollection('diary_images');
    }
    
    // Update streak
    $user = auth()->user();
    if ($user->streak) {
        $user->streak->updateAfterSubmission(now());
    } else {
        Streak::create([
            'student_id' => $user->id,
            'current_streak' => 1,
            'longest_streak' => 1,
            'last_submission' => now(),
        ]);
        }

        return redirect()->route('dashboard')
            ->with('success', '宿題を提出しました！');
    }


    public function show($id)
    {
        $homework = Homework::findOrFail($id);
        $homework->load(['student', 'feedback']);
        return Inertia::render('Homework/Show', [
            'homework' => $homework,
        ]);
    }
} 