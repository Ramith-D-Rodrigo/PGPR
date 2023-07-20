<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'initials'=> fake()->randomLetter(),
            'surname' => fake()->lastName(),
            'roles' => json_encode(['qac', 'cqa', 'reviewer']),
            'contact_no' => json_encode(['0712345678', '0776543210']),
            'profile_pic' => fake()->imageUrl(),
            'official_telephone_no' => fake()->phoneNumber(),
            'nic' => strval(fake()->randomNumber(8)),
            'gender' => fake()->randomElement(['m', 'f']),
            'official_email' => fake()->unique()->safeEmail(),
            'personal_email' => fake()->unique()->safeEmail(),
            'created_by' => 1,
            'status' => fake()->randomElement(['active', 'inactive']),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // password
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
