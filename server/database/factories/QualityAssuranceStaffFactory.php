<?php

namespace Database\Factories;

use App\Models\UniversitySide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QualityAssuranceStaff>
 */
class QualityAssuranceStaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //'id' => UniversitySide::factory(),
            'assigned_date' => fake()->date(),
        ];
    }
}
