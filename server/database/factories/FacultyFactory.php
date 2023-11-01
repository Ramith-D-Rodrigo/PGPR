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
            'contact_no' => json_encode(['data'=>[fake()->phoneNumber()]]),
            'fax_no' => json_encode(['data'=>[fake()->e164PhoneNumber()]]),
        ];
    }


    public function faculty_of_medicine_colombo(): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Faculty of Medicine',
            'website' => 'https://med.cmb.ac.lk/',
            'address' => 'Faculty of Medicine, University of Colombo, Kynsey Road, Colombo 08, Sri Lanka',
            'contact_no' => json_encode(['data'=> ['0112695301']]),
            'fax_no' => json_encode(['data'=>['0112695301']]),
        ]);
    }

    public function faculty_of_engineering_moratuwa(): static {
        return $this->state(fn(array $attributes) => [
            'name' => 'Faculty of Engineering',
            'website' => 'https://uom.lk/foe/',
            'address' => 'Faculty of Engineering, University of Moratuwa, Katubedda, Moratuwa, Sri Lanka',
            'contact_no' => json_encode(['data'=> ['0112650301']]),
            'fax_no' => json_encode(['data'=>['0112650622']]),
        ]);
    }
}
