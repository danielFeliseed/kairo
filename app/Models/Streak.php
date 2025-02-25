<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Streak extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'current_streak',
        'longest_streak',
        'last_submission',
        'missed_days',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_submission' => 'date',
        'missed_days' => 'array',
    ];

    /**
     * Get the student this streak belongs to
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Update the streak information after a homework submission
     *
     * @param string|Carbon $submissionDate
     * @return bool
     */
    public function updateAfterSubmission($submissionDate)
    {
        $submissionDate = $submissionDate instanceof Carbon 
            ? $submissionDate 
            : Carbon::parse($submissionDate);
        
        // Get missed days (if any)
        $missedDays = $this->missed_days ?? [];
        
        // If this is the first submission
        if (!$this->last_submission) {
            $this->current_streak = 1;
            $this->longest_streak = 1;
        } else {
            $lastSubmission = $this->last_submission;
            $dayDifference = $submissionDate->diffInDays($lastSubmission);
            
            if ($dayDifference == 1 || ($dayDifference == 0 && $submissionDate->gt($lastSubmission))) {
                // Consecutive day submission
                $this->current_streak += 1;
                
                // Update longest streak if current is longer
                if ($this->current_streak > $this->longest_streak) {
                    $this->longest_streak = $this->current_streak;
                }
            } elseif ($dayDifference > 1) {
                // Streak broken, record missed days
                $missedDate = $lastSubmission->copy()->addDay();
                while ($missedDate->lt($submissionDate)) {
                    $missedDays[] = $missedDate->format('Y-m-d');
                    $missedDate->addDay();
                }
                
                // Reset streak
                $this->current_streak = 1;
            }
        }
        
        $this->last_submission = $submissionDate;
        $this->missed_days = $missedDays;
        
        return $this->save();
    }

    /**
     * Check if the student has an active streak (submitted homework yesterday or today)
     */
    public function isActive()
    {
        if (!$this->last_submission) {
            return false;
        }
        
        $today = Carbon::today();
        $daysSinceLastSubmission = $today->diffInDays($this->last_submission);
        
        return $daysSinceLastSubmission <= 1;
    }

    /**
     * Get a percentage of how close the current streak is to the longest streak
     */
    public function getStreakPercentageAttribute()
    {
        if ($this->longest_streak == 0) {
            return 0;
        }
        
        return min(100, round(($this->current_streak / $this->longest_streak) * 100));
    }

    /**
     * Get array of dates with homework submissions for the calendar
     */
    public function getSubmissionDatesAttribute()
    {
        return $this->student->homework()
            ->where('status', '!=', 'missed')
            ->pluck('homework_date')
            ->map(function ($date) {
                return $date->format('Y-m-d');
            })
            ->toArray();
    }
}