<?php

namespace Database\Factories;

use App\Models\ViceChancellor;
use App\Models\UniversitySide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ViceChancellor>
 */
class ViceChancellorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    // model being used
    protected $model = ViceChancellor::class;

    public function definition(): array
    {
        return [
            'id' => UniversitySide::factory(),
            'appointed_date' => fake()->date(),
            'term_date' => fake()->date(),
            'status' => fake()->randomElement(['ACTIVE', 'INACTIVE']),
        ];
    }
}
