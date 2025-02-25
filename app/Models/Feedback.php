<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'homework_id',
        'teacher_id',
        'feedback_text',
        'rating',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the homework this feedback is for
     */
    public function homework()
    {
        return $this->belongsTo(Homework::class);
    }

    /**
     * Get the teacher who provided this feedback
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the student who received this feedback
     */
    public function student()
    {
        return $this->homework->student;
    }

    /**
     * Scope a query to get the latest feedback for a student
     */
    public function scopeLatestForStudent($query, $studentId)
    {
        return $query->whereHas('homework', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })->latest();
    }

    /**
     * Check if the feedback has a rating
     */
    public function hasRating()
    {
        return !is_null($this->rating);
    }

    /**
     * Get the star rating as an array of stars (for easier display)
     */
    public function getStarsAttribute()
    {
        $stars = [];
        $rating = min(5, max(0, $this->rating ?? 0));
        
        for ($i = 1; $i <= 5; $i++) {
            $stars[] = $i <= $rating;
        }
        
        return $stars;
    }
}