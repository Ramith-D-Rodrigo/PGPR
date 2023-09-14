<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PostGraduateProgram>
 */
class PostGraduateProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'title' => fake()->randomElement(['MSc', 'MPhil', 'PhD']),
            'slqf_level' => fake()->numberBetween(6, 12),
            'commencement_year' => fake()->year(),
        ];
    }
}
