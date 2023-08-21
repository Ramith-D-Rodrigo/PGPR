<?php

namespace Database\Factories;

use App\Models\Faculty;
use Cassandra\UuidInterface;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InternalQualityAssuranceUnit>
 */
class InternalQualityAssuranceUnitFactory extends Factory
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
            'address' => fake()->address(),
            'contact_no' => json_encode(fake()->phoneNumber()),
            'fax_no' => json_encode(fake()->e164PhoneNumber()),
            'email' => fake()->email(),
        ];
    }
}
