<?php

namespace App\Policies;

use App\Http\Requests\V1\DeanAcceptReviewTeamRequest;
use App\Http\Requests\V1\DeanRejectReviewTeamRequest;
use App\Http\Requests\V1\StoreDeanRequest;
use App\Models\Dean;
use App\Models\Faculty;
use App\Models\ReviewTeam;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Auth;

class DeanPolicy
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
    public function view(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, StoreDeanRequest $request): Response
    {
        //only cqa director can create dean
        $currentRole = request() -> session() -> get('authRole');

        if($currentRole != 'cqa director'){
            return Response::deny('You are not allowed to create a dean account');
        }

        //cqa director can only create dean account to faculty that is belong to the university of the cqa director

        $cqaUniversity = $user -> universitySide -> university_id;

        $deanFaculty = $request -> faculty_id;

        $deanUniversity = Faculty::find($deanFaculty) -> university_id;

        if($cqaUniversity != $deanUniversity){
            return Response::deny('You are not allowed to create a dean account to this faculty');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Dean $dean): bool
    {
        //
    }

    //function to remove the role of dean (after the term date or if the dean has ended the term)
    public function removeRole(User $user, Dean $dean): Response
    {
        //only cqa director can remove the role of dean
        $currentRole = request() -> session() -> get('authRole');

        if($currentRole != 'cqa_director'){
            return Response::deny('You are not allowed to remove the role of dean');
        }

        //cqa director can only remove the role of dean from faculty that is belong to the university of the cqa director

        $cqaUniversity = $user -> universitySide -> university_id;

        $deanUniversity = $dean -> faculty -> university_id;

        if($cqaUniversity != $deanUniversity){
            return Response::deny('You are not allowed to remove the role of dean from this faculty');
        }

        return Response::allow();
    }

    public function authorizeAcceptReviewTeam(User $user, DeanAcceptReviewTeamRequest $request) : Response{
        return $this -> authorizeAllowRejectReviewTeam($user, $request -> id, 'accept');
    }

    public function authorizeRejectReviewTeam(User $user, DeanRejectReviewTeamRequest $request) : Response {
        return $this -> authorizeAllowRejectReviewTeam($user, $request -> id, 'reject');
    }

    private function authorizeAllowRejectReviewTeam(User $user, $reviewTeamId, string $action) : Response {
        //only dean can authorize the review team
        $currentRole = request() -> session() -> get('authRole');

        if($currentRole != 'dean'){
            return Response::deny('You are not allowed to ' . $action . ' the review team');
        }

        //dean can only authorize the review team that is assigned to a pgpr of a postgraduate program that is offered by dean's faculty

        $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty;

        $reviewTeam = ReviewTeam::findOrFail($reviewTeamId);

        $reviewTeamPGPFaculty = $reviewTeam -> postGraduateReviewProgram -> postGraduateProgram -> faculty;

        if($deanFaculty -> id != $reviewTeamPGPFaculty -> id){
            return Response::deny('You are not allowed to ' . $action . ' the review team');
        }

        //cannot reject the team when pgpr is not in planning stage or submitted stage

        if($reviewTeam -> postGraduateReviewProgram -> status_of_pgpr != 'PLANNING' && $reviewTeam -> postGraduateReviewProgram -> status_of_pgpr != 'SUBMITTED'){
            return Response::deny('You are not allowed to ' . $action . ' the review team when it is not in the planning stage.');
        }

        return Response::allow();
    }
}
