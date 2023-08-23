<?php

namespace Database\Seeders;

use App\Models\AcademicStaff;
use App\Models\CenterForQualityAssurance;
use App\Models\Dean;
use App\Models\Faculty;
use App\Models\University;
use App\Models\UniversitySide;
use App\Models\User;
use App\Models\ViceChancellor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $viceChancellor = ViceChancellor::factory()->for(
            UniversitySide::factory()->for(
                User::factory()->vice_chancellor()->create()
            )->create()
        );

        $dean = Dean::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->dean()->create()
                    )->create()
                )
            );

        University::factory()
            ->has($viceChancellor)
            ->has(CenterForQualityAssurance::factory())
            ->has(Faculty::factory()->has($dean))
            ->create();
    }
}
