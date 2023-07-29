<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\AcademicStaff;
use App\Models\QualityAssuranceStaff;
use App\Models\UniversitySide;
use App\Models\ViceChancellor;
use Database\Factories\UniversitySideFactory;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\App;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    /*public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // User::factory()->count(5)->hasUniversitySide()->create();
        // UniversitySide::factory()->count(10)->create();

        User::factory()->programme_coordinator()->hasUniversitySide()->create();
        User::factory()->cqa_director()->hasUniversitySide()->create();
        User::factory()->reviewer()->hasUniversitySide()->create();
        User::factory()->iqau_director()->hasUniversitySide()->create();
        User::factory()->vice_chancellor()->hasUniversitySide()->create();

        User::factory()->qac_officer()->hasQualityAssuranceCouncilOfficer()->create();
        //User::factory()->qac_director()->hasQualityAssuranceStaff()->create();
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // UniversitySide::factory()->count(10)->create();
        // AcademicStaff::factory()->count(10)->create();
        // ViceChancellor::factory()->count(10)->create();
        // QualityAssuranceStaff::factory()->count(10)->create();

        User::factory()->count(10)->hasUniversitySide()->create();
        UniversitySide::factory()->hasViceChancellor()->create();

        //run criteria seeder
        // $this -> call([CriteriaSeeder::class]);

        //run standard seeder
        // $this -> call([StandardSeeder::class]);
    }*/

    // new run function for seeding

    public function run(): void
    {
        UniversitySide::factory()->count(10)->create();
    }
}
