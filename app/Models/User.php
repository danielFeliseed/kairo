<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
// use Spatie\MediaLibrary\HasMedia;
// use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'teacher_id',
        'family_id',
        'profile_color',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the teacher of this student
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get students of this teacher
     */
    public function students()
    {
        return $this->hasMany(User::class, 'teacher_id');
    }

    /**
     * Get the family this student belongs to
     */
    public function family()
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get homework submissions for this student
     */
    public function homework()
    {
        return $this->hasMany(Homework::class, 'student_id');
    }

    /**
     * Get feedback provided by this teacher
     */
    public function providedFeedback()
    {
        return $this->hasMany(Feedback::class, 'teacher_id');
    }

    /**
     * Get the streak information for this student
     */
    public function streak()
    {
        return $this->hasOne(Streak::class, 'student_id');
    }

    /**
     * Check if user is a teacher
     */
    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    /**
     * Check if user is a student
     */
    public function isStudent()
    {
        return $this->role === 'student';
    }

    /**
     * Get families managed by this teacher
     */
    public function managedFamilies()
    {
        return $this->hasMany(Family::class, 'teacher_id');
    }

    /**
     * Register media collections
     */
    // public function registerMediaCollections(): void
    // {
    //     $this->addMediaCollection('avatars')
    //         ->singleFile();
    // }

    /**
     * Get profile color or generate one if not set
     */
    public function getProfileColorAttribute($value)
    {
        if (!$value) {
            // Define a set of pleasant colors for profiles
            $colors = [
                '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
                '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                '#FFC107', '#FF9800', '#FF5722'
            ];
            
            // Pick a consistent color based on user ID
            $value = $colors[$this->id % count($colors)];
            
            // Save it for next time
            $this->profile_color = $value;
            $this->save();
        }
        
        return $value;
    }
}