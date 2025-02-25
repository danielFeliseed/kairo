<?php

namespace Database\Factories;

use App\Models\Homework;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HomeworkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Homework::class;

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
        
        // Generate a random date within the last 30 days
        $date = $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d');
        
        return [
            'student_id' => $student->id,
            'homework_date' => $date,
            'teacher_notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'status' => $this->faker->randomElement(['submitted', 'reviewed', 'submitted']), // More likely to be submitted
        ];
    }
    
    /**
     * Configure the homework as reviewed.
     */
    public function reviewed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'reviewed',
        ]);
    }
    
    /**
     * Configure the homework as missed.
     */
    public function missed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'missed',
        ]);
    }
}