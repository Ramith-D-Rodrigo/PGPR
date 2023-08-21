<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faculty>
 */
class FacultyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'website' => fake()->url(),
            'address' => fake()->address(),
            'contact_no' => json_encode(fake()->phoneNumber()),
            'fax_no' => json_encode(fake()->e164PhoneNumber()),
        ];
    }
}
