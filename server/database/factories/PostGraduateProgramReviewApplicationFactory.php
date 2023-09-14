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
            //random years
            "year_1" => fake() -> randomElement(['2020', '2021', '2022', '2023', '2024', '2025']),
            "year_2" => fake() -> randomElement(['2020', '2021', '2022', '2023', '2024', '2025']),
            "year_3" => fake() -> randomElement(['2020', '2021', '2022', '2023', '2024', '2025']),
            "year_4" => fake() -> randomElement(['2020', '2021', '2022', '2023', '2024', '2025']),
            "year_5" => fake() -> randomElement(['2020', '2021', '2022', '2023', '2024', '2025']),
            "y_end" => fake()->date()
        ];
    }
}
