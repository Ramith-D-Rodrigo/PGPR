<?php

namespace Database\Seeders;

use App\Models\AcademicStaff;
use App\Models\CenterForQualityAssurance;
use App\Models\CenterForQualityAssuranceDirector;
use App\Models\Dean;
use App\Models\Faculty;
use App\Models\InternalQualityAssuranceUnit;
use App\Models\InternalQualityAssuranceUnitDirector;
use App\Models\PostGraduateProgram;
use App\Models\PostGraduateProgramReview;
use App\Models\PostGraduateProgramReviewApplication;
use App\Models\ProgrammeCoordinator;
use App\Models\QualityAssuranceStaff;
use App\Models\Reviewer;
use App\Models\ReviewTeam;
use App\Models\University;
use App\Models\UniversitySide;
use App\Models\User;
use App\Models\ViceChancellor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostGraduateProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {



        //to verify
        /*$post_graduate_programs = Reviewer::find($reviewer->id)->reviewTeams; // will be a collection

        var_dump(sizeof($post_graduate_programs));

        //for each team there is a pgpr
        foreach ($post_graduate_programs as $p) {
            var_dump($p->postGraduateReviewProgram);
        }*/
    }
}
