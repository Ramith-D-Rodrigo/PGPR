<?php

namespace App\Policies;

use App\Http\Requests\V1\StoreAssignReviewTeamMemberCriteriaRequest;
use App\Http\Requests\V1\StoreConductDeskEvaluationRequest;
use App\Http\Requests\V1\StoreConductProperEvaluationRequest;
use App\Http\Requests\V1\UpdateReviewChairSubmitDERequest;
use App\Http\Requests\V1\UpdateReviewChairSubmitPERequest;
use App\Models\PostGraduateProgramReview;
use App\Models\ReviewTeam;
use App\Models\User;
use Illuminate\Http\Response;


class ReviewTeamChairPolicy
{
    public function assignReviewTeamMembersCriteriaForProperEvaluationAuthorize(User $user, StoreAssignReviewTeamMemberCriteriaRequest $request) : Response
    {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not a reviewer, not authorized to make this request.');
        }

        $reviewTeam = ReviewTeam::findOrFail($request->review_team_id);

        $pgpr = $reviewTeam -> postGraduateReviewProgram;

        if($pgpr -> status_of_pgpr != 'PE1'){
            return Response::deny('You cannot assign criteria at this stage.');
        }

        $reviewers = $reviewTeam->reviewers;

        foreach($reviewers as $reviewer){
            if($reviewer->pivot -> reviewer_id == $user -> id && $reviewer -> pivot -> role == 'CHAIR'){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to assign criteria to this review team.');
    }

    public function submitDeskEvaluationAuthorize(User $user, UpdateReviewChairSubmitDERequest $request) : Response
    {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not a reviewer, not authorized to make this request.');
        }

        $pgpr = PostGraduateProgramReview::findOrFail($request -> pgpr_id);

        if($pgpr -> status_of_pgpr != 'DE'){
            return Response::deny('You cannot submit desk evaluation at this stage.');
        }

        $reviewTeam = $pgpr -> acceptedReviewTeam;

        $reviewers = $reviewTeam -> reviewers;

        foreach($reviewers as $reviewer){
            if($reviewer->pivot -> reviewer_id == $user -> id && $reviewer -> pivot -> role == 'CHAIR'){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to submit desk evaluation for this review team.');
    }

    public function submitProperEvaluationAuthorize(User $user, UpdateReviewChairSubmitPERequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not a reviewer, not authorized to make this request.');
        }

        $pgpr = PostGraduateProgramReview::findOrFail($request -> pgpr_id);

        if($pgpr -> status_of_pgpr != 'PE2'){
            return Response::deny('You cannot submit proper evaluation at this stage.');
        }

        $reviewTeam = $pgpr -> acceptedReviewTeam;

        $reviewers = $reviewTeam -> reviewers;

        foreach($reviewers as $reviewer){
            if($reviewer->pivot -> reviewer_id == $user -> id && $reviewer -> pivot -> role == 'CHAIR'){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to submit proper evaluation for this review team.');
    }

    public function updatePEScoresOfEachStandardAuthorize(User $user, StoreConductProperEvaluationRequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not a reviewer, not authorized to make this request.');
        }

        $pgpr = PostGraduateProgramReview::findOrFail($request -> pgpr_id);

        if($pgpr -> status_of_pgpr != 'PE1' || $pgpr -> status_of_pgpr != 'PE2'){
            return Response::deny('You cannot update proper evaluation scores at this stage.');
        }

        $reviewTeam = $pgpr -> acceptedReviewTeam;

        $reviewers = $reviewTeam -> reviewers;

        foreach($reviewers as $reviewer){
            if($reviewer->pivot -> reviewer_id == $user -> id && $reviewer -> pivot -> role == 'CHAIR'){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to update proper evaluation scores for this review team.');
    }

    public function updateDEScoresOfEachStandardAuthorize(User $user, StoreConductDeskEvaluationRequest $request) : Response {
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'reviewer'){
            return Response::deny('You are not a reviewer, not authorized to make this request.');
        }

        $pgpr = PostGraduateProgramReview::findOrFail($request -> pgpr_id);

        if($pgpr -> status_of_pgpr != 'DE'){
            return Response::deny('You cannot update desk evaluation scores at this stage.');
        }

        $reviewTeam = $pgpr -> acceptedReviewTeam;

        $reviewers = $reviewTeam -> reviewers;

        foreach($reviewers as $reviewer){
            if($reviewer->pivot -> reviewer_id == $user -> id && $reviewer -> pivot -> role == 'CHAIR'){
                return Response::allow();
            }
        }

        return Response::deny('You are not allowed to update desk evaluation scores for this review team.');
    }

}
