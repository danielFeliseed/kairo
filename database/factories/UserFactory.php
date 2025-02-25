<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Family;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;
    
    /**
     * Track which student we're creating (alternates between Maika and Manami)
     */
    protected static int $studentCounter = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => '先生',
            'email' => 'teacher@example.com',
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'teacher', // Default to teacher
            'teacher_id' => null,
            'family_id' => null,
            'profile_color' => '#4CAF50', // Green for teacher
        ];
    }

    /**
     * Configure the model to be a teacher.
     */
    public function teacher(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => '先生',
            'role' => 'teacher',
            'email' => 'teacher@example.com',
        ]);
    }

    /**
     * Configure the model to be a student.
     */
    public function student(): static
    {
        return $this->state(function (array $attributes) {
            // Get a teacher
            $teacher = User::where('role', 'teacher')->first()
                    ?? User::factory()->teacher()->create();
            
            // Get the Takeda family
            $family = Family::where('name', '武田家')->first()
                    ?? Family::factory()->create(['teacher_id' => $teacher->id]);
            
            // Alternate between Maika and Manami
            self::$studentCounter++;
            $studentNum = self::$studentCounter % 2;
            
            if ($studentNum === 1) {
                $name = 'まいか';
                $color = '#E91E63'; // Pink
            } else {
                $name = 'まなみ';
                $color = '#3F51B5'; // Indigo
            }
            
            return [
                'name' => $name,
                'role' => 'student',
                'teacher_id' => $teacher->id,
                'family_id' => $family->id,
                'email' => null, // Students don't need email
                'profile_color' => $color,
            ];
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}