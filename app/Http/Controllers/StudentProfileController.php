<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    /**
     * Display the student's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Student/Index', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the student's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'profile_color' => ['required', 'string', 'max:20'],
        ]);

        $request->user()->fill([
            'name' => $request->name,
            'profile_color' => $request->profile_color,
        ]);

        $request->user()->save();

        return Redirect::route('profile.student.edit');
    }
} 