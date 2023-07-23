<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\AcademicStaff;
use App\Models\QualityAssuranceStaff;
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
        // \App\Models\User::factory(10)->create();

        User::factory()->count(5)->hasUniversitySide()->create();
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // UniversitySide::factory()->count(10)->create();
        // AcademicStaff::factory()->count(10)->create();
        // ViceChancellor::factory()->count(10)->create();
        // QualityAssuranceStaff::factory()->count(10)->create();

        /*User::factory()->count(10)->hasUniversitySide()->create();
        UniversitySide::factory()->hasViceChancellor()->create();*/

        //run criteria seeder
        $this -> call([CriteriaSeeder::class]);
    }
}
