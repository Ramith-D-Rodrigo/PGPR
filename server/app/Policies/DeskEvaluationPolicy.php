<?php

namespace App\Policies;

use App\Models\DeskEvaluation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DeskEvaluationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, string $id): Response
    {
        $currRole = request()->session()->get('authRole');

        //qac_officer and qac_director can view any desk evaluation
        if ($currRole === 'qac_officer' || $currRole === 'qac_director') {
            return Response::allow();
        }

        $deskEvaluation = DeskEvaluation::findOrFail($id);

        //reviewer can only view desk evaluation that they are assigned to
        if ($currRole === 'reviewer') {

            $reviewTeam = $deskEvaluation -> postGraduateProgramReview -> acceptedReviewTeam;

            $reviewTeamReviewers = $reviewTeam -> reviewers;

            foreach ($reviewTeamReviewers as $reviewer) {
                if ($reviewer -> reviewer_id === $user -> id) {
                    return Response::allow();
                }
            }

            return Response::deny('You are not assigned to this desk evaluation');
        }

        //dean and iqau director can view only desk evaluations of a pgp that is offered by their faculty
        if($currRole === 'dean' || $currRole === 'iqau_director') {

            $deFaculty = $deskEvaluation -> postGraduateProgramReview -> postGraduateProgram -> faculty;

            if($currRole === 'dean'){
                if($deFaculty -> currentDean -> id === $user -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
            else{
                if($user -> id === $deFaculty -> internalQualityAssuranceUnit -> internalQualityAssuranceUnitDirector -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
        }

        //vice chancellor and cqa director can view only desk evaluations of pgps that are offered by their university
        if($currRole === 'vice_chancellor' || $currRole === 'cqa_director'){

            $deUniversity = $deskEvaluation -> postGraduateProgramReview -> postGraduateProgram -> faculty -> university;

            if($currRole === 'vice_chancellor'){
                if($deUniversity -> viceChancellor -> id === $user -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
            else{

                if($deUniversity -> centerForQualityAssurance -> currentQualityAssuranceDirector -> id === $user -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
        }

        //programme coordinator can view only desk evaluations of pgps that they are assigned to
        if($currRole === 'programme_coordinator'){

            $dePgp = $deskEvaluation -> postGraduateProgramReview -> postGraduateProgram;

            if($dePgp -> currentProgrammeCoordinator -> id === $user -> id){
                return Response::allow();
            }
            else{
                return Response::deny('You are not authorized to view this desk evaluation');
            }
        }

        return Response::deny('You are not authorized to view this desk evaluation');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {

    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DeskEvaluation $deskEvaluation): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DeskEvaluation $deskEvaluation): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DeskEvaluation $deskEvaluation): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DeskEvaluation $deskEvaluation): bool
    {
        //
    }
}
