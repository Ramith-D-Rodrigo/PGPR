<?php

namespace Database\Seeders;

use App\Models\AcademicStaff;
use App\Models\CenterForQualityAssurance;
use App\Models\Dean;
use App\Models\Faculty;
use App\Models\PostGraduateProgramReviewApplication;
use App\Models\ProgrammeCoordinator;
use App\Models\Reviewer;
use App\Models\ReviewTeam;
use App\Models\University;
use App\Models\UniversitySide;
use App\Models\ViceChancellor;
use Database\Factories\PostGraduateProgramReviewApplicationFactory;
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

        /*//run reviewer seeder
        $this->call([ReviewerSeeder::class]);
        $this->call([ReviewerSeeder::class]);

        //run review team seeder
        $this->call([ReviewerSeeder::class]);

        //run university seeder
        $this->call([FacultySeeder::class]);*/

        $this->call([PostGraduateProgramSeeder::class]);

        //run criteria seeder
        $this->call([CriteriaSeeder::class]);

        //run standard seeder
        $this->call([StandardSeeder::class]);
    }
}
