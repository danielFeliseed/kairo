<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
class StudentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'family_id' => 'required|exists:families,id',
        ]);

        $student = User::create([
            'name' => $request->name,
            'family_id' => $request->family_id,
            'profile_color' => $request->profile_color,
            'role' => 'student',
            'password' => Hash::make('password'),
            'teacher_id' => Auth::user()->id,
        ]);

        return redirect()->route('teacher-dashboard')->with('success', '生徒が追加されました。');
    }

    public function destroy(Request $request, User $user)
    {
        $user->delete();

        return redirect()->route('teacher-dashboard')->with('success', '生徒が削除されました。');
    }
}