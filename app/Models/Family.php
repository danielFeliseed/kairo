<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Family extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'access_code',
        'teacher_id',
    ];

    /**
     * Generate a unique, easy-to-type access code
     */
    public static function generateAccessCode()
    {
        // Generate a 6-character alphanumeric code (avoiding confusing chars like 0/O, 1/I)
        $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $code = '';
        
        for ($i = 0; $i < 6; $i++) {
            $code .= $characters[random_int(0, strlen($characters) - 1)];
        }
        
        // Check if code already exists
        if (self::where('access_code', $code)->exists()) {
            return self::generateAccessCode(); // Try again
        }
        
        return $code;
    }

    /**
     * Get the teacher who manages this family
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the students in this family
     */
    public function students()
    {
        return $this->hasMany(User::class, 'family_id')->where('role', 'student');
    }

    /**
     * Get the count of students in this family
     */
    public function getStudentCountAttribute()
    {
        return $this->students()->count();
    }

    /**
     * Get all homework submissions from students in this family
     */
    public function allHomework()
    {
        return Homework::whereIn('student_id', $this->students()->pluck('id'));
    }

    /**
     * Generate a new access code for this family
     */
    public function regenerateAccessCode()
    {
        $this->update([
            'access_code' => self::generateAccessCode()
        ]);
        
        return $this->access_code;
    }
}