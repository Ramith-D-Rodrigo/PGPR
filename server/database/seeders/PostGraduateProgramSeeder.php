<?php

namespace Database\Seeders;

use App\Models\AcademicStaff;
use App\Models\CenterForQualityAssurance;
use App\Models\Dean;
use App\Models\Faculty;
use App\Models\PostGraduateProgram;
use App\Models\PostGraduateProgramReview;
use App\Models\PostGraduateProgramReviewApplication;
use App\Models\ProgrammeCoordinator;
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

        $university = University::factory()->create(); //model

        $viceChancellor = ViceChancellor::factory()->for(
            UniversitySide::factory()->for(
                User::factory()->vice_chancellor()->create()
            )->for($university)->create()
        )->create(); //model

        $dean = Dean::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->dean()->create()
                    )->for($university)->create()
                )->create()
            )->create(); //model

        $reviewer =  Reviewer::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->reviewer()->create()
                    )->for($university)->create()
                )->create()
            )->create();

        $program_coordinator = ProgrammeCoordinator::factory()->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->dean()->create()
                )->for($university)->create()
            )->create()
        )->create(); //model

        $post_graduate_program = PostGraduateProgram::factory()->create(); //model

        $pgpr_applcation = PostGraduateProgramReviewApplication::factory()->create(); //model

        $pgpr = PostGraduateProgramReview::factory()->create(); //model

        $review_team = ReviewTeam::factory()->create(); //model

        $faculty = Faculty::factory()->create(); //model

        //filling the gaps for postgraduate program
        $post_graduate_program->faculty_id = $faculty->id;
        $post_graduate_program->programme_coordinator_id = $program_coordinator->id;
        $post_graduate_program->save();

        //filling the gaps for program coordinator
        $program_coordinator->faculty_id = $faculty->id;
        $program_coordinator->post_grad_program_id = $post_graduate_program->id;
        $program_coordinator->save();

        //filling the gaps for university
        $university->vice_chancellor_id = $viceChancellor->id;
        $university->save();

        //filling the gaps for faculty
        $faculty->university_id = $university->id;
        $faculty->dean_id = $dean->id;
        $faculty->save();

        //filling the gaps for dean
        $dean->faculty_id = $faculty->id;
        $dean->save();

        //filling the gaps for prpr application
        $pgpr_applcation->post_graduate_program_id = $post_graduate_program->id;
        $pgpr_applcation->dean_id = $dean->id;

        // filling the gaps for pgpr
        $pgpr->post_graduate_program_id = $post_graduate_program->id;
        $pgpr->pgpr_application_id = $pgpr_applcation->id;
        $pgpr->save();

        // filling the gaps for review team
        $review_team->pgpr_id = $pgpr->id;
        $review_team->dean_id = $dean->id;
        $review_team->save();

        // filling the gaps for reviewer
        $reviewer->working_faculty = $faculty->id;
        $reviewer->save();

        //attaching reviewers to the review team
        $review_team->reviewers()->attach($reviewer);

        //to verify
        /*$post_graduate_programs = Reviewer::find($reviewer->id)->reviewTeams; // will be a collection

        var_dump(sizeof($post_graduate_programs));

        //for each team there is a pgpr
        foreach ($post_graduate_programs as $p) {
            var_dump($p->postGraduateReviewProgram);
        }*/
    }
}
