<?php

namespace App\Policies;

use App\Models\CenterForQualityAssuranceDirector;
use App\Models\InternalQualityAssuranceUnitDirector;
use App\Models\Dean;
use App\Models\ProgrammeCoordinator;
use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\Reviewer;
use App\Models\ViceChancellor;
use App\Models\ReviewTeam;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReviewTeamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        //get current logged in user role
        $currRole = request() -> session() -> get('authRole');

        //check if the user is a quality assurance officer or quality assurance director
        if($currRole === 'qac_director' || $currRole === 'qac_officer'){
            return Response::allow();
        }

        return Response::deny('You are not authorized to view review teams');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReviewTeam $reviewTeam): Response
    {
        //qac officer and director can view any review team
        //dean can view only the review team of pgpr that belongs to his faculty
        //programme coordinator can view only the review team of pgpr that belongs to his programme
        //reviewer can view only the review team that he is assigned to
        //vice chancellor can view review teams of all pgprs of all faculties of his university
        //iqau director can view review teams of all pgprs of his faculty
        //cqa director can view review teams of all pgprs of all faculties of his university

        //get current logged in user role
        $currRole = request() -> session() -> get('authRole');

        switch($currRole){
            case 'qac_director':
            case 'qac_officer':
                return Response::allow();

            case 'dean':
                //get the faculty of the dean
                $deanFaculty = Dean::find($user -> id) -> faculty;

                //get the faculty of the pgpr
                $pgprFaculty = $reviewTeam -> postGraduateReviewProgram -> postGraduateProgram -> faculty;

                //check if the dean's faculty is the same as the pgpr's faculty
                if($deanFaculty -> id === $pgprFaculty -> id){
                    return Response::allow();
                }
                break;

            case 'programme_coordinator':
                //get the programme of the programme coordinator
                $programmeCoordinatorProgramme = ProgrammeCoordinator::find($user -> id) -> postGraduateProgram;

                //get the programme of the pgpr
                $pgprProgramme = $reviewTeam -> postGraduateProgramReview -> postGraduateProgram;

                //check if the programme coordinator's programme is the same as the pgpr's programme
                if($programmeCoordinatorProgramme -> id === $pgprProgramme -> id){
                    return Response::allow();
                }
                break;

            case 'reviewer':
                //get the id of the reviewer
                $reviewerId = $user -> id;

                //check if the reviewer is assigned to the review team
                if($reviewTeam -> reviewers -> contains('reviewer_id', $reviewerId)){
                    return Response::allow();
                }
                break;

            case 'vice_chancellor':
                //get the university of the vice chancellor
                $viceChancellorUniversity = ViceChancellor::find($user -> id) -> university;

                //get the university of the pgpr
                $pgprUniversity = $reviewTeam -> postGraduateProgramReview -> postGraduateProgram -> faculty -> university;

                //check if the vice chancellor's university is the same as the pgpr's university
                if($viceChancellorUniversity -> id === $pgprUniversity -> id){
                    return Response::allow();
                }
                break;

            case 'iqau_director':
                //get the faculty of the iqau director
                $iqauDirectorFaculty = InternalQualityAssuranceUnitDirector::find($user -> id) -> internalQualityAssuranceUnit -> faculty;

                //get the faculty of the pgpr
                $pgprFaculty = $reviewTeam -> postGraduateProgramReview -> postGraduateProgram -> faculty;

                //check if the iqau director's faculty is the same as the pgpr's faculty
                if($iqauDirectorFaculty -> id === $pgprFaculty -> id){
                    return Response::allow();
                }
                break;

            case 'cqa_director':
                //get the university of the cqa director
                $cqaDirectorUniversity = CenterForQualityAssuranceDirector::find($user -> id) -> university;

                //get the university of the pgpr
                $pgprUniversity = $reviewTeam -> postGraduateProgramReview -> postGraduateProgram -> faculty -> university;

                //check if the cqa director's university is the same as the pgpr's university
                if($cqaDirectorUniversity -> id === $pgprUniversity -> id){
                    return Response::allow();
                }
                break;
        }

        return Response::deny('You are not authorized to view this review team');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only quality assurance officers and directors can create review teams

        //get current logged in user role
        $currRole = request() -> session() -> get('authRole');

        //check if the user is a quality assurance officer or quality assurance director
        if($currRole === 'qac_director' || $currRole === 'qac_officer'){
            return Response::allow();
        }

        return Response::deny('You are not authorized to create review teams');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ReviewTeam $reviewTeam): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReviewTeam $reviewTeam): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ReviewTeam $reviewTeam): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ReviewTeam $reviewTeam): Response
    {
        //only quality assurance officers and directors can delete review teams
        $currRole = request() -> session() -> get('authRole');

        //check if the user is a quality assurance officer or quality assurance director
        if($currRole === 'qac_director'){
            return Response::allow();
        }

        return Response::deny('You are not authorized to delete review teams');
    }
}
