<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Family;
use App\Models\Homework;
use App\Models\Feedback;
use App\Models\Streak;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a teacher
        $teacher = User::factory()->teacher()->create();

        // Create the Takeda family
        $family = Family::factory()->create([
            'teacher_id' => $teacher->id,
        ]);

        // Create Maika and Manami
        $maika = User::factory()->student()->create();
        $manami = User::factory()->student()->create();

        // Create homework for each student (5-10 entries per student)
        foreach ([$maika, $manami] as $student) {
            // Generate homework entries
            $homeworkCount = rand(5, 10);
            
            $homeworkEntries = [];
            
            for ($i = 0; $i < $homeworkCount; $i++) {
                // Calculate a date for this homework (working backwards from today)
                $date = now()->subDays($i)->format('Y-m-d');
                
                // Determine status (more likely to be reviewed for older entries)
                $status = $i < 2 ? 'submitted' : 'reviewed';
                
                // Create the homework entry
                $homework = Homework::create([
                    'student_id' => $student->id,
                    'homework_date' => $date,
                    'status' => $status,
                ]);
                
                $homeworkEntries[] = $homework;
            }
            
            // Add feedback for reviewed homework
            foreach ($homeworkEntries as $homework) {
                if ($homework->status === 'reviewed') {
                    Feedback::factory()->create([
                        'homework_id' => $homework->id,
                        'teacher_id' => $teacher->id,
                    ]);
                }
            }
            
            // Create streak for each student (4-day streak)
            Streak::create([
                'student_id' => $student->id,
                'current_streak' => 4,
                'longest_streak' => 6,
                'last_submission' => now()->format('Y-m-d'),
                'missed_days' => json_encode([
                    now()->subDays(6)->format('Y-m-d'),
                    now()->subDays(7)->format('Y-m-d'),
                ]),
            ]);
        }
    }
}