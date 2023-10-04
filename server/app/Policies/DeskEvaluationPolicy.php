<?php

namespace App\Policies;

use App\Http\Requests\V1\ShowDeskEvaluationRemarksRequest;
use App\Http\Requests\V1\ShowStandardWiseDetailsOfEachCriteriaRequest;
use App\Http\Requests\V1\UpdateDeskEvaluationRequest;
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
                $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty;
                if($deanFaculty -> id === $deFaculty -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
            else{
                $iqauFaculty = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty;

                if($iqauFaculty -> id === $deFaculty -> id){
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
                $vcUni = $user -> universitySide -> viceChancellor -> university;
                if($vcUni -> id === $deUniversity -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
            else{
                $cqaUni = $user -> universitySide -> qualityAssuranceStaff -> centerForQualityAssuranceDirector -> centerForQualityAssurance -> university;
                if($cqaUni -> id === $deUniversity -> id){
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
            $coordinatorPgp = $user -> universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram;
            if($dePgp -> id === $coordinatorPgp -> id){
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
    public function update(User $user, string $id): Response
    {
        //only review chair of the desk evaluation can update the desk evaluation
        $currRole = request()->session()->get('authRole');

        if($currRole === 'reviewer'){

            $deskEvaluation = DeskEvaluation::findOrFail($id);

            $reviewTeam = $deskEvaluation -> postGraduateProgramReview -> acceptedReviewTeam;

            $reviewTeamReviewers = $reviewTeam -> reviewers;

            foreach ($reviewTeamReviewers as $reviewer) {
                if ($reviewer -> reviewer_id === $user -> id) {
                    //check if the reviewer is the chair
                    if($reviewer -> role === 'CHAIR'){
                        return Response::allow();
                    }
                    else{
                        return Response::deny('You are not authorized to update this desk evaluation');
                    }
                }
            }

            return Response::deny('You are not assigned to this desk evaluation');
        }

        return Response::deny('You are not authorized to update this desk evaluation');
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

    public function viewStandardWiseDetailsOfEachCriteriaInDE(User $user, ShowStandardWiseDetailsOfEachCriteriaRequest $request) : Response {
        $currRole = request()->session()->get('authRole');

        return $this -> viewAuthorization($user, $request -> desk_evaluation_id, $currRole);
    }

    public function getDeskEvaluationRemarkAndScoreForStandard(User $user, ShowDeskEvaluationRemarksRequest $request): Response {
        $currRole = request()->session()->get('authRole');

        return $this -> viewAuthorization($user, $request -> desk_evaluation_id, $currRole);
    }

    private function viewAuthorization(User $user, $deId, $currRole) : Response {
        $deskEvaluation = DeskEvaluation::findOrFail($deId);

        if($currRole == 'reviewer'){
            //check if the reviewer is assigned to the desk evaluation

            $reviewTeam = $deskEvaluation -> postGraduateProgramReview -> acceptedReviewTeam;

            $reviewTeamReviewers = $reviewTeam -> reviewers;

            foreach ($reviewTeamReviewers as $reviewer) {
                if ($reviewer -> reviewer_id == $user -> id) {
                    return Response::allow();
                }
            }

            return Response::deny('You are not assigned to this desk evaluation');
        }
        else if($currRole == 'qac_director' || $currRole == 'qac_officer'){
            //can view any De
            return Response::allow();
        }
        else if($currRole == 'vice_chancellor' || $currRole == 'cqa_director'){
            //can only view de's of their university

            $deUniversity = $deskEvaluation -> postGraduateProgramReview -> postGraduateProgram -> faculty -> university;

            if($currRole == 'vice_chancellor'){
                $vcUni = $user -> universitySide -> viceChancellor -> university;

                if($vcUni -> id == $deUniversity -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
            else if($currRole == 'cqa_director'){
                $cqaUni = $user -> universitySide -> qualityAssuranceStaff -> centerForQualityAssuranceDirector -> centerForQualityAssurance -> university;

                if($cqaUni -> id === $deUniversity -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
        }
        else if($currRole == 'iqau_director' || $currRole == 'dean'){
            //can only view des of their faculty
            $deFaculty = $deskEvaluation -> postGraduateProgramReview -> postGraduateProgram -> faculty;

            if($currRole == 'iqau_director'){
                $iqauFaculty = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty;

                if($iqauFaculty -> id == $deFaculty -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
            else if($currRole == 'dean'){
                $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty;

                if($deanFaculty -> id == $deFaculty -> id){
                    return Response::allow();
                }
                else{
                    return Response::deny('You are not authorized to view this desk evaluation');
                }
            }
        }
        else if($currRole == 'programme_coordinator'){
            //can only view des of pgps that they are assigned to
            $dePgp = $deskEvaluation -> postGraduateProgramReview -> postGraduateProgram;

            $pcPgp = $user -> universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram;

            if($pcPgp -> id == $dePgp -> id){
                return Response::allow();
            }
            else{
                return Response::deny('You are not authorized to view this desk evaluation');
            }
        }

        return Response::deny('You are not authorized to view this desk evaluation');
    }
}
