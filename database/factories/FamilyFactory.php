<?php

namespace Database\Factories;

use App\Models\Family;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FamilyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Family::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a teacher user or create one if none exists
        $teacher = User::where('role', 'teacher')->inRandomOrder()->first() 
                ?? User::factory()->create(['role' => 'teacher']);
        
        // Generate a unique access code
        $accessCode = $this->generateUniqueAccessCode();
        
        return [
            'name' => $this->faker->lastName() . '家', // Japanese style family name
            'access_code' => $accessCode,
            'teacher_id' => $teacher->id,
        ];
    }
    
    /**
     * Generate a unique 6-character access code.
     */
    protected function generateUniqueAccessCode(): string
    {
        // Characters to use (avoid confusing characters like 0/O, 1/I)
        $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $code = '';
        
        do {
            // Generate a 6-character code
            $code = '';
            for ($i = 0; $i < 6; $i++) {
                $code .= $characters[rand(0, strlen($characters) - 1)];
            }
        } while (Family::where('access_code', $code)->exists());
        
        return $code;
    }
}