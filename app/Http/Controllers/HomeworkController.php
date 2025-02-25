<?php

namespace App\Http\Controllers;

use App\Models\Homework;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeworkController extends Controller
{
    public function index()
    {
        $homework = Homework::all(); // Fetch all homework records
        return Inertia::render('Homework/Index', [
            'homework' => $homework,
        ]);
    }

    public function show($id)
    {
        $homework = Homework::findOrFail($id); // Fetch specific homework record
        return Inertia::render('Homework/Show', [
            'homework' => $homework,
        ]);
    }
} 