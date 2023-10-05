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
use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\QualityAssuranceStaff;
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
        //User::factory()->programme_coordinator()->hasUniversitySide()->create();
        //User::factory()->cqa_director()->hasUniversitySide()->create();
        //User::factory()->iqau_director()->hasUniversitySide()->create();
        //User::factory()->vice_chancellor()->hasUniversitySide()->create();

        $officer = User::factory()->qac_officer()->hasQualityAssuranceCouncilOfficer()->create();
        $director = QualityAssuranceCouncilOfficer::factory()->for(User::factory()->qac_director())->hasQualityAssuranceCouncilDirector()->create();


        $university = University::factory()->for(CenterForQualityAssurance::factory()->create())->create(); //model

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
                        User::factory()->reviewer_1()->create()
                    )->for($university)->create()
                )->create()
            )->create();

        $reviewer2 =  Reviewer::factory()
        ->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->reviewer_2()->create()
                )->for($university)->create()
            )->create()
        )->create();

        $reviewer3 =  Reviewer::factory()
        ->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->reviewer_3()->create()
                )->for($university)->create()
            )->create()
        )->create();

        $program_coordinator = ProgrammeCoordinator::factory()->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->programme_coordinator()->create()
                )->for($university)->create()
            )->create()
        )->create(); //model

        $post_graduate_program = PostGraduateProgram::factory()->create(); //model

        $pgpr_applcation = PostGraduateProgramReviewApplication::factory()->for($post_graduate_program)->create(); //model

        $pgpr = PostGraduateProgramReview::factory()->create(); //model

        $review_team = ReviewTeam::factory()->create(); //model

        $faculty = Faculty::factory()->has(InternalQualityAssuranceUnit::factory())->create(); //model

        $iqauDir = InternalQualityAssuranceUnitDirector::factory()->for(
            QualityAssuranceStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->iqau_director()->create()
                )->for($university)->create()
            )->create()
        )->create(); //model

        $cqaDir = CenterForQualityAssuranceDirector::factory()->for(
            QualityAssuranceStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->cqa_director()->create()
                )->for($university)->create()
            )->create()
        )->for($university->centerForQualityAssurance)->create(); //model

        $university -> centerForQualityAssurance -> center_for_quality_assurance_director_id = $cqaDir->id;
        $university -> centerForQualityAssurance -> save();

        $iqauDir -> iqau_id = $faculty->internalQualityAssuranceUnit->id;
        $faculty->internalQualityAssuranceUnit->iqau_dir_id = $iqauDir->id;
        $faculty->internalQualityAssuranceUnit->save();
        $iqauDir->save();


        //filling the gaps for postgraduate program
        $post_graduate_program->faculty_id = $faculty->id;
        $post_graduate_program->programme_coordinator_id = $program_coordinator->id;
        $post_graduate_program->added_by_cqa_director_id = $cqaDir->id;
        $post_graduate_program->save();

        //filling the gaps for program coordinator
        $program_coordinator->faculty_id = $faculty->id;
        $program_coordinator->post_grad_program_id = $post_graduate_program->id;
        $program_coordinator->save();

        //filling the gaps for university
        $university->vice_chancellor_id = $viceChancellor->id;
        $viceChancellor->university_id = $university->id;
        $viceChancellor->save();
        $university->save();

        //filling the gaps for faculty
        $faculty->university_id = $university->id;
        $faculty->dean_id = $dean->id;
        $faculty->save();

        //filling the gaps for dean
        $dean->faculty_id = $faculty->id;
        $dean->save();

        //filling the gaps for prpr application

        //first submission by dean and applied by cqa director
        $pgpr_applcation->dean_id = $dean->id; //created by dean
        $pgpr_applcation->status = 'applied';
        $pgpr_applcation->application_date = now();
        $pgpr_applcation->save();

        //secondly, approved by qac officer
        $pgpr_applcation->status = 'approved';
        $pgpr_applcation->quality_assurance_council_officer_id = $officer->id;
        $pgpr_applcation->save();

        // filling the gaps for pgpr
        $pgpr->post_graduate_program_id = $post_graduate_program->id;
        $pgpr->pgpr_application_id = $pgpr_applcation->id;
        $pgpr->save();

        //create self evaluation report for pgpr
        $pgpr->selfEvaluationReport()->create([
            'pgp_coordinator_id' => $program_coordinator->id,
            'iqau_dir_id' => $iqauDir->id]);

        // filling the gaps for review team
        $review_team->pgpr_id = $pgpr->id;
        $review_team->dean_id = $dean->id;
        $review_team->qualityAssuranceCouncilOfficer()->associate($officer);    //created by qac officer
        $review_team->save();

        // filling the gaps for reviewer
        $reviewer->working_faculty = $faculty->id;
        $reviewer->save();

        $reviewer2->working_faculty = $faculty->id;
        $reviewer2->save();

        $reviewer3->working_faculty = $faculty->id;
        $reviewer3->save();

        //attaching reviewers to the review team
        $review_team->reviewers()->attach($reviewer, ['role' => 'MEMBER', 'reviewer_confirmation' => 'ACCEPTED']);
        $review_team->reviewers()->attach($reviewer2, ['role' => 'MEMBER', 'reviewer_confirmation' => 'ACCEPTED']);
        $review_team->reviewers()->attach($reviewer3, ['role' => 'CHAIR', 'reviewer_confirmation' => 'ACCEPTED']);

        //dean accepts the review team
        $review_team->status = 'ACCEPTED';
        $review_team->dean_decision= 'less goo';
        $review_team->dean()->associate($dean);
        $review_team->save();

        /*//run reviewer seeder
        $this->call([ReviewerSeeder::class]);
        $this->call([ReviewerSeeder::class]);

        //run review team seeder
        $this->call([ReviewerSeeder::class]);

        //run university seeder
        $this->call([FacultySeeder::class]);*/

        //$this->call([PostGraduateProgramSeeder::class]);

        //run criteria seeder
        $this->call([CriteriaSeeder::class]);

        //run standard seeder
        $this->call([StandardSeeder::class]);
    }
}
