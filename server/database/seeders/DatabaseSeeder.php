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


        $university = University::factory()->colombo_uni()->for(CenterForQualityAssurance::factory()->create())->create(); //model
        $university2 = University::factory()->moratuwa_uni()->for(CenterForQualityAssurance::factory()->create())->create(); //model

        $viceChancellor = ViceChancellor::factory()->for(
            UniversitySide::factory()->for(
                User::factory()->vice_chancellor()->set_email(env('VC1_SAMPLE_EMAIL'))->create()
            )->for($university)->create()
        )->create(); //model

        $viceChancellor2 = ViceChancellor::factory()->for(
            UniversitySide::factory()->for(
                User::factory()->vice_chancellor()->set_email(env('VC2_SAMPLE_EMAIL'))->create()
            )->for($university2)->create()
        )->create(); //model

        $dean = Dean::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->dean()->set_email(env('DEAN1_SAMPLE_EMAIL'))->create()
                    )->for($university)->create()
                )->create()
            )->create(); //model

        $dean2 = Dean::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->dean()->set_email(env('DEAN2_SAMPLE_EMAIL'))->create()
                    )->for($university2)->create()
                )->create()
            )->create(); //model

        $reviewer =  Reviewer::factory()
            ->for(
                AcademicStaff::factory()->for(
                    UniversitySide::factory()->for(
                        User::factory()->reviewer_1()->set_email(env('REV_1_SAMPLE_EMAIL'))->create()
                    )->for($university2)->create()
                )->create()
            )->create();

        $reviewer2 =  Reviewer::factory()
        ->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->reviewer_2()->set_email(env('REV_2_SAMPLE_EMAIL'))->create()
                )->for($university2)->create()
            )->create()
        )->create();

        $reviewer3 =  Reviewer::factory()
        ->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->reviewer_3()->set_email(env('REV_3_SAMPLE_EMAIL'))->create()
                )->for($university2)->create()
            )->create()
        )->create();

        $program_coordinator = ProgrammeCoordinator::factory()->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->programme_coordinator()->set_email(env('COOR1_SAMPLE_EMAIL'))->create()
                )->for($university)->create()
            )->create()
        )->create(); //model

        $program_coordinator2 = ProgrammeCoordinator::factory()->for(
            AcademicStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->programme_coordinator()->set_email(env('COOR2_SAMPLE_EMAIL'))->create()
                )->for($university2)->create()
            )->create()
        )->create(); //model

        $post_graduate_program = PostGraduateProgram::factory()->master_of_science_in_biomedical_informatics()->create(); //model
        $post_graduate_program2 = PostGraduateProgram::factory()->master_of_science_in_computer_engineering()->create(); //model

        $pgpr_applcation = PostGraduateProgramReviewApplication::factory()->for($post_graduate_program)->create(); //model

        $pgpr = PostGraduateProgramReview::factory()->create(); //model

        $review_team = ReviewTeam::factory()->create(); //model

        $faculty = Faculty::factory()->faculty_of_medicine_colombo()->has(InternalQualityAssuranceUnit::factory())->create(); //model
        $faculty2 = Faculty::factory()->faculty_of_engineering_moratuwa()->has(InternalQualityAssuranceUnit::factory())->create(); //model

        $iqauDir = InternalQualityAssuranceUnitDirector::factory()->for(
            QualityAssuranceStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->iqau_director()->set_email(env('IQAU1_SAMPLE_EMAIL'))->create()
                )->for($university)->create()
            )->create()
        )->create(); //model

        $iqauDir2 = InternalQualityAssuranceUnitDirector::factory()->for(
            QualityAssuranceStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->iqau_director()->set_email(env('IQAU2_SAMPLE_EMAIL'))->create()
                )->for($university2)->create()
            )->create()
        )->create(); //model

        $cqaDir = CenterForQualityAssuranceDirector::factory()->for(
            QualityAssuranceStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->cqa_director()->set_email(env('CQA1_SAMPLE_EMAIL'))->create()
                )->for($university)->create()
            )->create()
        )->for($university->centerForQualityAssurance)->create(); //model

        $cqaDir2 = CenterForQualityAssuranceDirector::factory()->for(
            QualityAssuranceStaff::factory()->for(
                UniversitySide::factory()->for(
                    User::factory()->cqa_director()->set_email(env('CQA2_SAMPLE_EMAIL'))->create()
                )->for($university2)->create()
            )->create()
        )->for($university2->centerForQualityAssurance)->create(); //model

        $university -> centerForQualityAssurance -> center_for_quality_assurance_director_id = $cqaDir->id;
        $university -> centerForQualityAssurance -> save();

        $university2 -> centerForQualityAssurance -> center_for_quality_assurance_director_id = $cqaDir2->id;
        $university2 -> centerForQualityAssurance -> save();

        $iqauDir -> iqau_id = $faculty->internalQualityAssuranceUnit->id;
        $faculty->internalQualityAssuranceUnit->iqau_dir_id = $iqauDir->id;
        $faculty->internalQualityAssuranceUnit->save();
        $iqauDir->save();

        $iqauDir2 -> iqau_id = $faculty2->internalQualityAssuranceUnit->id;
        $faculty2->internalQualityAssuranceUnit->iqau_dir_id = $iqauDir2->id;
        $faculty2->internalQualityAssuranceUnit->save();
        $iqauDir2->save();


        //filling the gaps for postgraduate program
        $post_graduate_program->faculty_id = $faculty->id;
        $post_graduate_program->programme_coordinator_id = $program_coordinator->id;
        $post_graduate_program->added_by_cqa_director_id = $cqaDir->id;
        $post_graduate_program->save();

        $post_graduate_program2->faculty_id = $faculty2->id;
        $post_graduate_program2->programme_coordinator_id = $program_coordinator->id;
        $post_graduate_program2->added_by_cqa_director_id = $cqaDir2->id;
        $post_graduate_program2->save();

        //filling the gaps for program coordinator
        $program_coordinator->faculty_id = $faculty->id;
        $program_coordinator->post_grad_program_id = $post_graduate_program->id;
        $program_coordinator->save();

        $program_coordinator2->faculty_id = $faculty2->id;
        $program_coordinator2->post_grad_program_id = $post_graduate_program2->id;
        $program_coordinator2->save();

        //filling the gaps for university
        $university->vice_chancellor_id = $viceChancellor->id;
        $viceChancellor->university_id = $university->id;
        $viceChancellor->save();
        $university->save();

        $university2->vice_chancellor_id = $viceChancellor2->id;
        $viceChancellor2->university_id = $university2->id;
        $viceChancellor2->save();
        $university2->save();

        //filling the gaps for faculty
        $faculty->university_id = $university->id;
        $faculty->dean_id = $dean->id;
        $faculty->save();

        $faculty2->university_id = $university2->id;
        $faculty2->dean_id = $dean2->id;
        $faculty2->save();


        //filling the gaps for dean
        $dean->faculty_id = $faculty->id;
        $dean->save();

        $dean2 -> faculty_id = $faculty2->id;
        $dean2->save();


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
        $reviewer->working_faculty = $faculty2->id;
        $reviewer->save();

        $reviewer2->working_faculty = $faculty2->id;
        $reviewer2->save();

        $reviewer3->working_faculty = $faculty2->id;
        $reviewer3->save();

        //attaching reviewers to the review team
        $review_team->reviewers()->attach($reviewer, ['role' => 'MEMBER', 'reviewer_confirmation' => 'ACCEPTED']);
        $review_team->reviewers()->attach($reviewer2, ['role' => 'MEMBER', 'reviewer_confirmation' => 'ACCEPTED']);
        $review_team->reviewers()->attach($reviewer3, ['role' => 'CHAIR', 'reviewer_confirmation' => 'ACCEPTED']);

        //dean accepts the review team
        $review_team->status = 'ACCEPTED';
        $review_team->dean_decision= 'ACCEPTED';
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
