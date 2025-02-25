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
        $teacher = User::where('role', 'teacher')->first() 
                ?? User::factory()->create(['role' => 'teacher']);
        
        // Always return Takeda family with TAKEDA access code
        return [
            'name' => '武田家',
            'access_code' => 'TAKEDA',
            'teacher_id' => $teacher->id,
        ];
    }
}