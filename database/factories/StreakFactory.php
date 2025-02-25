<?php

namespace Database\Factories;

use App\Models\Streak;
use App\Models\User;
use App\Models\Homework;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class StreakFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Streak::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a student or create one
        $student = User::where('role', 'student')->inRandomOrder()->first()
                ?? User::factory()->student()->create();
        
        // Calculate streak based on student's homework submissions
        $homework = Homework::where('student_id', $student->id)
                  ->where('status', '!=', 'missed')
                  ->orderBy('homework_date', 'desc')
                  ->get();
        
        // Default values
        $currentStreak = 0;
        $longestStreak = 0;
        $lastSubmission = null;
        $missedDays = [];
        
        if ($homework->count() > 0) {
            // Get the most recent submission
            $lastSubmission = $homework->first()->homework_date;
            
            // Calculate current streak
            $currentDate = Carbon::parse($lastSubmission);
            $streakDates = [$currentDate->format('Y-m-d')];
            $currentStreak = 1;
            
            // Check previous days
            for ($i = 1; $i <= 30; $i++) {
                $prevDate = $currentDate->copy()->subDays($i);
                $hasSubmission = $homework->contains('homework_date', $prevDate->format('Y-m-d'));
                
                if ($hasSubmission) {
                    $currentStreak++;
                    $streakDates[] = $prevDate->format('Y-m-d');
                } else {
                    // Streak broken
                    break;
                }
            }
            
            // Calculate longest streak (simplified for demo)
            $longestStreak = max($currentStreak, $this->faker->numberBetween($currentStreak, $currentStreak + 5));
            
            // Generate some missed days
            $startDate = Carbon::now()->subDays(30);
            $endDate = Carbon::now();
            
            for ($i = 0; $i < $this->faker->numberBetween(2, 8); $i++) {
                $missedDate = $this->faker->dateTimeBetween($startDate, $endDate)->format('Y-m-d');
                
                // Only add if it's not in the streak dates
                if (!in_array($missedDate, $streakDates)) {
                    $missedDays[] = $missedDate;
                }
            }
        }
        
        return [
            'student_id' => $student->id,
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
            'last_submission' => $lastSubmission,
            'missed_days' => json_encode($missedDays),
        ];
    }
}