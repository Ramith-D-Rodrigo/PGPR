<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Criteria>
 */
class CriteriaFactory extends Factory
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
        ];
    }

    public function criteria1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Programme Management',
                'weightage_on_thousand' => 150
            ];
        });
    }

    public function criteria2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Programme Design and Development',
                'weightage_on_thousand' => 150
            ];
        });
    }

    public function criteria3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Human and Physical Resources and Learner Support',
                'weightage_on_thousand' => 150
            ];
        });
    }

    public function criteria4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Teaching- Learning and Research',
                'weightage_on_thousand' => 150
            ];
        });
    }

    public function criteria5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Student Assessment and Award of Qualification',
                'weightage_on_thousand' => 150
            ];
        });
    }

    public function criteria6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Programme Evaluation',
                'weightage_on_thousand' => 150
            ];
        });
    }

    public function criteria7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Innovative and Healthy Practices',
                'weightage_on_thousand' => 100
            ];
        });
    }
}
