<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Spatie\MediaLibrary\HasMedia;
// use Spatie\MediaLibrary\InteractsWithMedia;
use Carbon\Carbon;

class Homework extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'homework';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'homework_date',
        'teacher_notes',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'homework_date' => 'date',
    ];

    /**
     * Get the student who submitted this homework
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the feedback for this homework
     */
    public function feedback()
    {
        return $this->hasOne(Feedback::class);
    }

    /**
     * Scope a query to only include homework from a specific date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('homework_date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include reviewed homework
     */
    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    /**
     * Scope a query to only include unreviewed (submitted) homework
     */
    public function scopeUnreviewed($query)
    {
        return $query->where('status', 'submitted');
    }

    /**
     * Scope a query to only include homework for today
     */
    public function scopeToday($query)
    {
        return $query->whereDate('homework_date', Carbon::today());
    }

    /**
     * Check if this homework has been submitted for today
     */
    public function isTodaysHomework()
    {
        return $this->homework_date->isToday();
    }

    /**
     * Check if this homework has been reviewed
     */
    public function isReviewed()
    {
        return $this->status === 'reviewed';
    }

    public function getLatestFeedback()
    {
        return $this->feedback()->latest()->first();
    }

    /**
     * Register media collections
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('diary_images')
            ->singleFile();
    }

    /**
     * Get the image URL for this homework
     */
    // public function getImageUrlAttribute()
    // {
    //     $media = $this->getMedia('diary_images')->first();
    //     return $media ? $media->getUrl() : null;
    // }
}