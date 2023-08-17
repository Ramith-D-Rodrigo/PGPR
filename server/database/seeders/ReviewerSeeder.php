<?php

namespace Database\Seeders;

use App\Models\AcademicStaff;
use App\Models\Reviewer;
use App\Models\UniversitySide;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Reviewer::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->reviewer()->create()
                    )->create()
                )->create()
            )->create();
    }
}
