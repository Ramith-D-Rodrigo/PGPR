<?php

namespace Database\Factories;

use App\Models\UniversitySide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AcademicStaff>
 */
class AcademicStaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'designation' => fake()->word(),
            'experience_in_industry' => json_encode(['JOB_1', 'JOB_2', 'JOB_3', 'JOB_4']),
            'experience_with_research_funds' => json_encode(['EXP_1', 'EXP_2', 'EXP_3', 'EXP_4']),
            'google_scholar_link' => fake()->word(),
            'nominees' => json_encode(['NOM_1', 'NOM_2', 'NOM_3', 'NOM_4']),
            'department' => json_encode(['DEP_1', 'DEP_2', 'DEP_3', 'DEP_4']),
            'supervised_postgraduate_student_count' => fake()->numberBetween([1], [200]),
            'publications_in_referred_journals_count' => fake()->numberBetween([1], [200]),
            'abstract_count' => fake()->numberBetween([1], [200]),
            'conference_preceedings_count' => fake()->numberBetween([1], [200]),
            'book_chapters' => fake()->numberBetween([1], [200]),
            'involvement_in_internal_quality_assurance' => json_encode(['INV_1', 'INV_2', 'INV_3', 'INV_4']),
            'involvement_in_study_programme_development' => json_encode(['INV_1', 'INV_2', 'INV_3', 'INV_4']),
            'postgraduate_teaching_experience' => json_encode(['EXP_1', 'EXP_2', 'EXP_3', 'EXP_4']),
            'postgraduate_qualifications' => json_encode(['QUA_1', 'QUA_2', 'QUA_3', 'QUA_4']),
            'prior_training_in_programme_review' => json_encode(['TRA_1', 'TRA_2', 'TRA_3', 'TRA_4']),
            'cv' => fake()->word(),
        ];
    }
}
