<?php

namespace App\Http\Controllers;

use App\Models\Homework;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

    public function show($id)
    {
        $homework = Homework::findOrFail($id);

        return Inertia::render('Homework/Show', [
            'homework' => $homework,
        ]);
    }
} 