<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CenterForQualityAssurance>
 */
class CenterForQualityAssuranceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contact_no' => json_encode([fake()->phoneNumber]),
            'fax_no' => json_encode([fake()->phoneNumber]),
            'email' => fake()->email,
        ];
    }
}
