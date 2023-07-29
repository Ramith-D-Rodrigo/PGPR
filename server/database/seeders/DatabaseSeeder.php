<?php

namespace Database\Seeders;

use App\Models\AcademicStaff;
use App\Models\CenterForQualityAssurance;
use App\Models\Dean;
use App\Models\Faculty;
use App\Models\Reviewer;
use App\Models\University;
use App\Models\UniversitySide;
use App\Models\ViceChancellor;
use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->programme_coordinator()->hasUniversitySide()->create();
        User::factory()->cqa_director()->hasUniversitySide()->create();
        User::factory()->iqau_director()->hasUniversitySide()->create();
        User::factory()->vice_chancellor()->hasUniversitySide()->create();

        $university = University::factory()
            ->has(
                ViceChancellor::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->vice_chancellor()->create()
                    )->create()
                ))
            ->has(
                CenterForQualityAssurance::factory()
            )->create();

        $dean = Dean::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->dean()->create()
                    )->create()
                )
            );

        $faculty = Faculty::factory()
            ->has($dean)
            ->for($university)
            ->create();

        Reviewer::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->reviewer()->create()
                    )->create()
                )->create()
            )->create();

        //run criteria seeder
        $this->call([CriteriaSeeder::class]);

        //run standard seeder
        $this->call([StandardSeeder::class]);
    }
}
