<?php

namespace Database\Factories;

use App\Models\DeskEvaluation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DeskEvaluation>
 */
class DeskEvaluationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'status' => "ONGOING",
        ];
    }
}
