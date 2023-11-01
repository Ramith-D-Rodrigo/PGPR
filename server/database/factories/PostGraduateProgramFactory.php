<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PostGraduateProgram>
 */
class PostGraduateProgramFactory extends Factory
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
            'title' => fake()->randomElement(['MSc', 'MPhil', 'PhD']),
            'slqf_level' => fake()->numberBetween(7, 12),
            'commencement_year' => fake()->year(),
        ];
    }

    public function master_of_science_in_biomedical_informatics(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => 'MSc in Biomedical Informatics',
            'slqf_level' => 9,
            'commencement_year' => 2019,
        ]);
    }


    public function master_of_science_in_computer_engineering(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => 'MSc in Computer Engineering',
            'slqf_level' => 9,
            'commencement_year' => 2019,
        ]);
    }
}
