<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FamilyController extends Controller
{
    /**
     * Show the family access page
     */
    public function access(Request $request)
    {
        $validated = $request->validate([
            'access_code' => 'required|string|size:6',
        ]);
        
        $family = Family::where('access_code', $validated['access_code'])->first();
        
        if (!$family) {
            return back()->withErrors([
                'access_code' => 'アクセスコードが正しくありません。',
            ]);
        }
        
        // Store the family ID in the session
        session(['family_id' => $family->id]);
        
        return redirect()->route('family.profiles');
    }
    
    /**
     * Show the Netflix-style profile selection page
     */
    public function showProfiles()
    {
        $familyId = session('family_id');
        
        if (!$familyId) {
            return redirect()->route('family.access');
        }
        
        $family = Family::with('students')->findOrFail($familyId);
        
        return Inertia::render('Families/Profiles', [
            'family' => $family,
            'students' => $family->students,
        ]);
    }
    
    /**
     * Login as a specific student
     */
    public function loginAsStudent(User $student)
    {
        $familyId = session('family_id');
        
        if (!$familyId || $student->family_id != $familyId) {
            return redirect()->route('family.access');
        }
        
        // Log in as the student
        Auth::login($student);
        
        // Store the family ID in the session for easy profile switching
        session(['family_id' => $familyId]);
        
        return redirect()->route('dashboard');
    }
}