<?php

namespace Database\Factories;

use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<University>
 */
class UniversityFactory extends Factory
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
            'name' => fake()->name(),
            'address' => fake()->address(),
            'website' => fake()->url(),
            'contact_no' => json_encode(['data'=> [fake()->phoneNumber()]]),
            'fax_no' => json_encode(['data'=>[fake()->e164PhoneNumber()]]),
            'center_for_quality_assurance_id' => null, // null for now
            'quality_assurance_council_director_id' => null, // null for now
        ];
    }


    public function colombo_uni(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'University of Colombo',
            'address' => 'Colombo 03',
            'website' => 'https://www.cmb.ac.lk/',
            'contact_no' => json_encode(['data'=> ['0112587211']]),
            'fax_no' => json_encode(['data'=>['0112587239']]),
        ]);
    }

    public function moratuwa_uni(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'University of Moratuwa',
            'address' => 'Moratuwa',
            'website' => 'https://uom.lk/',
            'contact_no' => json_encode(['data'=> ['0112650301']]),
            'fax_no' => json_encode(['data'=>['0112650622']]),
        ]);
    }
}
