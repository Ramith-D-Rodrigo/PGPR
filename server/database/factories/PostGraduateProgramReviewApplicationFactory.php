<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PostGraduateProgramReviewApplication>
 */
class PostGraduateProgramReviewApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'intent_letter' => fake()->words(1, true),
            'request_date' => fake()->date(),
            "year_1" => fake()->word(),
            "year_2" => fake()->word(),
            "year_3" => fake()->word(),
            "year_4" => fake()->word(),
            "year_5" => fake()->word(),
            "y_end" => fake()->date()
        ];
    }
}
