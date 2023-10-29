<?php

namespace App\Policies;

use App\Http\Requests\V1\ReviewerSubmitDeskEvaluation;
use App\Http\Requests\V1\StoreConductDeskEvaluationRequest;
use App\Http\Requests\V1\StoreConductProperEvaluationRequest;
use App\Http\Requests\V1\UpdateAcceptPGPRRequest;
use App\Http\Requests\V1\UpdateSERRemarksOfSectionsABDRequest;
use App\Http\Requests\V1\ReviewerSubmitProperEvaluation;
use App\Models\DeskEvaluation;
use App\Models\PostGraduateProgramReview;
use App\Models\Reviewer;
use App\Models\SelfEvaluationReport;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReviewerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        //only qac_officer and qac_director can view all reviewers
        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'qac_officer' || $currRole == 'qac_director') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to view reviewers.');
        }
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only qac_officer can create reviewer
        //since qac_director is also a qac_officer, qac_director can also create reviewer

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'qac_officer' || $currRole == 'qac_director') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to create reviewer.');
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Reviewer $reviewer): bool
    {
        //
    }


    public function downloadRoleAcceptanceDeclarationLetterAuthorize(User $user): Response
    {
        //qac_officer,qac_director and reviewer can download role acceptance declaration letter

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'qac_officer' || $currRole == 'qac_director' || $currRole == 'reviewer') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to download role acceptance declaration letter.');
        }
    }

    public function acceptRejectAppointmentAuthorize(User $user): Response
    {
        //only reviewer can accept appointment

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'reviewer') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to accept or reject appointment.');
        }
    }

    public function downloadReviewAppointmentDeclarationLetterAuthorize(User $user): Response
    {
        //only reviewer can download review appointment declaration letter

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'reviewer') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to download review appointment declaration letter.');
        }
    }

    public function browsePGPRsAuthorize(User $user): Response
    {
        //only reviewer can browse post graduate review programs of his endpoint

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'reviewer') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to browse post graduate review programs.');
        }
    }

    public function acceptRejectPGPRAssignmentAuthorize(User $user, $request) : Response
    {
        //only reviewer can accept post graduate review program assignment

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'reviewer') {
            //get the pgpr_id from the request
            $pgpr_id = $request -> pgpr_id;

            //find the pgpr_id
            $pgpr = PostGraduateProgramReview::findOrFail($pgpr_id);

            //get the review teams
            $reviewTeams = $pgpr -> reviewTeams;

            //go through each review team and check if the reviewer is in the review team
            foreach ($reviewTeams as $reviewTeam) {
                $reviewers = $reviewTeam -> reviewers;
                foreach ($reviewers as $reviewer) {
                    if ($reviewer -> pivot -> reviewer_id == $user -> id && ($reviewTeam -> status == 'ACCEPTED' || $reviewTeam -> status == 'PENDING')) {
                        return Response::allow();
                    }
                }
            }

            return Response::deny('You are not allowed to accept or reject post graduate review program assignment.');

        } else {
            return Response::deny('You are not allowed to accept or reject post graduate review program assignment.');
        }
    }

    public function updateRemarksOfSectionsABDAuthorize(User $user, UpdateSERRemarksOfSectionsABDRequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not allowed to update remarks of sections A, B and D.');
        }

        //check if the reviewer is in the review team who is assigned to the pgpr
        $SERid = $request -> ser_id; //self evaluation report id

        //find the self evaluation report
        $ser = SelfEvaluationReport::findOrFail($SERid);

        //get the review team
        $team = $ser -> postGraduateProgramReview -> acceptedReviewTeam;

        //get the reviewers

        //check if the reviewer is in the review team
        foreach($team -> reviewers as $reviewer){
            if($reviewer -> pivot -> reviewer_id == $user -> id){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to update remarks of sections A, B and D.');
    }


    public function conductDeskEvaluationAuthorize(User $user, StoreConductDeskEvaluationRequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not allowed to conduct desk evaluation.');
        }

        //check if the reviewer is in the review team who is assigned to the pgpr
        $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($request ->pgpr_id);

        return $this -> DEandPEAuthorization($user, $postGraduateReviewProgram, 'DE', 'conduct');
    }

    public function conductProperEvaluationAuthorize(User $user, StoreConductProperEvaluationRequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not allowed to conduct proper evaluation.');
        }

        //check if the reviewer is in the review team who is assigned to the pgpr
        $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($request ->pgpr_id);

        return $this -> DEandPEAuthorization($user, $postGraduateReviewProgram, 'PE', 'conduct');
    }

    public function submitDeskEvaluationAuthorize(User $user, ReviewerSubmitDeskEvaluation $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not allowed to submit desk evaluation.');
        }

        $postGraduateProgramReview = DeskEvaluation::findOrFail($request -> desk_evaluation_id) -> postGraduateProgramReview;

        return $this -> DEandPEAuthorization($user, $postGraduateProgramReview, 'DE', 'submit');

    }

    public function submitProperEvaluationAuthorize(User $user, ReviewerSubmitProperEvaluation $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not allowed to submit proper evaluation.');
        }

        //check if the reviewer is in the review team who is assigned to the pgpr
        $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($request -> proper_evaluation_id) -> postGraduateProgramReview;

        return $this -> DEandPEAuthorization($user, $postGraduateReviewProgram, 'PE', 'submit');
    }


    private function DEandPEAuthorization(User $user, PostGraduateProgramReview $pgpr, string $stage, string $requestType) : Response {
        switch($stage) {
            case 'DE' :
                if($pgpr -> status_of_pgpr != 'DE'){
                    return Response::deny('You are not allowed to ' . $requestType . ' desk evaluation.');
                }
                break;
            case 'PE' :
                if($pgpr -> status_of_pgpr != 'PE1' && $pgpr -> status_of_pgpr != 'PE2'){
                    return Response::deny('You are not allowed to ' . $requestType . ' proper evaluation.');
                }
                break;

        }

        //get the review team
        $team = $pgpr -> acceptedReviewTeam;

        //get the reviewers
        foreach($team -> reviewers as $reviewer){
            if($reviewer -> pivot -> reviewer_id == $user -> id){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to ' . $requestType . ' evaluation.');
    }


    public function rejectPGPRInEvaluationAuthorize(User $user, UpdateAcceptPGPRRequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not allowed to reject post graduate review program.');
        }

        //check if the reviewer is in the review team who is assigned to the pgpr
        $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($request -> pgpr_id);

        //check if the pgpr is in the evaluation stage
        if($postGraduateReviewProgram -> status_of_pgpr != 'DE' && $postGraduateReviewProgram -> status_of_pgpr != 'PE1' && $postGraduateReviewProgram -> status_of_pgpr != 'PE2'){
            return Response::deny('You are not allowed to reject post graduate review program.');
        }

        //get the review team
        $team = $postGraduateReviewProgram -> acceptedReviewTeam;

        //get the reviewers
        foreach($team -> reviewers as $reviewer){
            if($reviewer -> pivot -> reviewer_id == $user -> id){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to reject post graduate review program.');
    }
}
