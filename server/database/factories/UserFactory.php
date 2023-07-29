<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
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
            'initials' => fake()->randomLetter(),
            'surname' => fake()->lastName(),
            'contact_no' => json_encode(['0712345678', '0776543210']),
            'profile_pic' => fake()->imageUrl(),
            'official_telephone_no' => fake()->phoneNumber(),
            'nic' => strval(fake()->randomNumber(8)),
            'gender' => fake()->randomElement(['m', 'f']),
            'official_email' => fake()->unique()->safeEmail(),
            'personal_email' => fake()->unique()->safeEmail(),
            'created_by' => 1,
            'status' => 'active',
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
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function reviewer(): static
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['reviewer']),
        ]);
    }

    public function cqa_director(): static
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['cqa_director']),
        ]);
    }

    public function qac_officer(): static
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['qac_officer']),
        ]);
    }

    public function qac_director(): static
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['qac_director']),
        ]);
    }

    public function vice_chancellor(): static
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['vice_chancellor']),
        ]);
    }

    public function dean(): Factory
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['dean']),
        ]);
    }

    public function iqau_director(): Factory
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['iqau_director']),
        ]);
    }

    public function programme_coordinator(): Factory
    {
        return $this->state(fn(array $attributes) => [
            'roles' => json_encode(['programme_coordinator']),
        ]);
    }


}
