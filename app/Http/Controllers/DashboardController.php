<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Homework;
use App\Models\Streak;
use App\Models\User;
use App\Models\Feedback;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the appropriate dashboard based on user role
     *
     * @return Response
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        if ($user->role === 'teacher') {
            return $this->teacherDashboard($user);
        } else {
            return $this->studentDashboard($user);
        }
    }
    
    /**
     * Display the teacher dashboard
     *
     * @param User $teacher
     * @return Response
     */
    private function teacherDashboard(User $teacher): Response
    {
        // Get students with eager loaded relationships
        $students = $teacher->students()->with(['streak', 'family'])->get();
        
        // Map additional properties to students
        $students = $students->map(function($student) {
            // Ensure each student has a streak record
            if (!$student->streak) {
                $streak = new Streak([
                    'student_id' => $student->id,
                    'current_streak' => 0,
                    'longest_streak' => 0
                ]);
                $streak->save();
                $student->setRelation('streak', $streak);
            }
            
            // Add streak count to student object
            $student->streak_count = $student->streak->getCurrentStreak();
            $student->family_name = $student->family ? $student->family->name : null;
            
            return $student;
        });
        
        // Get managed families
        $families = $teacher->managedFamilies;
        
        // Get recent homework submissions
        $recentHomework = $this->getRecentHomework($students);
        
        return Inertia::render('TeacherDashboard', [
            'students' => $students,
            'recentHomework' => $recentHomework,
            'families' => $families,
        ]);
    }
    
    /**
     * Display the student dashboard
     *
     * @param User $student
     * @return Response
     */
    private function studentDashboard(User $student): Response
    {
        $today = now()->format('Y-m-d');
        
        // Ensure the student has a streak record
        $streak = $student->streak;
        if (!$streak) {
            $streak = Streak::create([
                'student_id' => $student->id,
                'current_streak' => 0,
                'longest_streak' => 0,
            ]);
            // Refresh the relationship
            $student->setRelation('streak', $streak);
        }
        
        // Get latest homework
        $latestHomework = Homework::where('student_id', $student->id)
            ->latest()
            ->first();
            
        $hasSubmittedToday = $latestHomework && 
            $latestHomework->homework_date->format('Y-m-d') == $today;
        
        // Get enhanced student with teacher
        $studentWithTeacher = User::with('teacher')->find($student->id);
        
        return Inertia::render('StudentDashboard', [
            'user' => $studentWithTeacher,
            'currentStreak' => $streak->getCurrentStreak(),
            'longestStreak' => $streak->getLongestStreak(),
            'lastSubmission' => $streak->getLastSubmission(),
            'currentStreakPercentage' => $streak->getStreakPercentageAttribute(),
            'latestHomework' => $latestHomework,
            'latestFeedback' => $latestHomework ? $latestHomework->getLatestFeedback() : null,
            'hasSubmittedToday' => $hasSubmittedToday,
        ]);
    }
    
    /**
     * Get recent homework submissions
     *
     * @param \Illuminate\Database\Eloquent\Collection $students
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getRecentHomework($students)
    {
        $recentHomework = Homework::whereIn('student_id', $students->pluck('id'))
            ->with('student')  // Eager load student
            ->orderBy('homework_date', 'desc')
            ->limit(5)
            ->get();
            
        return $recentHomework->map(function ($homework) {
            $homework->studentName = $homework->student->name;
            $homework->homeworkDate = $homework->homework_date;
            return $homework;
        });
    }
}