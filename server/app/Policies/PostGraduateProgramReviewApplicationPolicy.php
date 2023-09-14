<?php

namespace App\Policies;

use App\Http\Requests\V1\StorePostGraduateProgramReviewApplicationRequest;
use App\Models\PostGraduateProgram;
use App\Models\PostGraduateProgramReviewApplication;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostGraduateProgramReviewApplicationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        //programme coordinator, reviewer cannot view any applications

        $currUserRole = request() -> session() -> get('authRole');
        if ($currUserRole == 'programme_coordinator' || $currUserRole == 'reviewer') {
            return Response::deny('You are not allowed to view any applications');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): Response
    {
        //programme coordinator, reviewer cannot view any applications

        $currUserRole = request() -> session() -> get('authRole');
        if ($currUserRole == 'programme_coordinator' || $currUserRole == 'reviewer') {
            return Response::deny('You are not allowed to view any applications');
        }

        //get the university of the application
        $applicationUniversity = $postGraduateProgramReviewApplication
                                -> postGraduateProgram
                                -> faculty
                                -> university -> id;

        //get the faculty of the application
        $applicationFaculty = $postGraduateProgramReviewApplication
                            -> postGraduateProgram
                            -> faculty -> id;

        //dean can only view applications of his/her faculty
        if ($currUserRole == 'dean') {
            //get the faculty of the dean
            $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty -> id;

            if ($deanFaculty != $applicationFaculty) {
                return Response::deny('You are not allowed to view this application');
            }
        }
        //cqa_director can only view applications of his/her faculty
        else if($currUserRole == 'cqa_director'){

            //get the university of the cqa director
            $cqaUniversity = $user -> universitySide
                            -> qualityAssuranceStaff
                            -> centerForQualityAssuranceDirector
                            -> centerForQualityAssurance
                            -> university -> id;

            if ($cqaUniversity != $applicationUniversity) {
                return Response::deny('You are not allowed to view this application');
            }
        }
        //iqau_director can only view applications of his/her faculty
        else if($currUserRole == 'iqau_director'){

            //get the faculty of the iqau director
            $iqauFaculty = $user -> universitySide
                            -> qualityAssuranceStaff
                            -> internalQualityAssuranceUnitDirector
                            -> internalQualityAssuranceUnit
                            -> faculty -> id;

            if ($iqauFaculty != $applicationFaculty) {
                return Response::deny('You are not allowed to view this application');
            }
        }
        //vice chancellor can only view applications of his/her faculty
        else if($currUserRole == 'vice_chancellor'){

            //get the university of the vice chancellor
            $vcUniversity = $user -> universitySide
                            -> viceChancellor
                            -> university -> id;

            if ($vcUniversity != $applicationUniversity) {
                return Response::deny('You are not allowed to view this application');
            }
        }
        //qac_officer and qac_director can only the applied applications (cannot view creating and submitted applications)
        else if($currUserRole == 'qac_officer' || $currUserRole == 'qac_director'){
            if(in_array($postGraduateProgramReviewApplication -> status, ['creating', 'submitted'])){
                return Response::deny('You are not allowed to view this application');
            }
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, StorePostGraduateProgramReviewApplicationRequest $request): Response
    {
        //only dean can create applications
        $currUserRole = request() -> session() -> get('authRole');

        if ($currUserRole != 'dean') {
            return Response::deny('You are not allowed to create an application');
        }

        //dean can only create applications for pgps in his/her faculty
        $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty -> id;

        //get the faculty of the application
        $pgpId = $request -> post_graduate_program_id;

        $pgpFaculty = PostGraduateProgram::find($pgpId) -> faculty -> id;

        if ($deanFaculty != $pgpFaculty) {
            return Response::deny('You are not allowed to create an application for this post graduate program');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): Response
    {
        //only dean can update the application, but only if it is not submitted and he should be the same person who created the application
        $currUserRole = request() -> session() -> get('authRole');

        if ($currUserRole != 'dean') {
            return Response::deny('You are not allowed to update this application');
        }

        //dean can only update applications for pgps in his/her faculty
        $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty -> id;

        //get the faculty of the application
        $applicationFaculty = $postGraduateProgramReviewApplication -> postGraduateProgram -> faculty_id;

        if ($deanFaculty != $applicationFaculty) {
            return Response::deny('You are not allowed to update this application');
        }

        //dean can only update applications that have status of 'creating'
        if ($postGraduateProgramReviewApplication -> status != 'creating') {
            return Response::deny('You are not allowed to update this application');
        }

        //dean can only update applications that he created
        $deanId = $user -> id;

        if($postGraduateProgramReviewApplication -> dean_id != $deanId){
            return Response::deny('You are not allowed to update this application');
        }

        return Response::allow();
    }

    public function submitAuthorize(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): Response
    {
        //only dean can submit the application, but only if it is not submitted and he should be the same person who created the application
        $currUserRole = request() -> session() -> get('authRole');

        if ($currUserRole != 'dean') {
            return Response::deny('You are not allowed to submit this application');
        }

        //dean can only submit applications for pgps in his/her faculty
        $deanFaculty = $user -> universitySide -> academicStaff -> dean -> faculty -> id;

        //get the faculty of the application
        $applicationFaculty = $postGraduateProgramReviewApplication -> postGraduateProgram -> faculty_id;

        if ($deanFaculty != $applicationFaculty) {
            return Response::deny('You are not allowed to submit this application');
        }

        //dean can only submit applications that have status of 'creating'
        if ($postGraduateProgramReviewApplication -> status != 'creating') {
            return Response::deny('You are not allowed to submit this application');
        }

        //dean can only submit applications that he created
        $deanId = $user -> id;

        if($postGraduateProgramReviewApplication -> dean_id != $deanId){
            return Response::deny('You are not allowed to submit this application');
        }

        return Response::allow();
    }


    public function cqaDirectorRecommendationAuthorize(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): Response
    {
        //only cqa director can recommend authorization of the application, but only if it is submitted

        $currUserRole = request() -> session() -> get('authRole');

        if ($currUserRole != 'cqa_director') {
            return Response::deny('You are not allowed to recommend this application');
        }

        //cqa director can only recommend applications for pgps in his/her university
        $cqaUniversity = $user -> universitySide
                            -> qualityAssuranceStaff
                            -> centerForQualityAssuranceDirector
                            -> centerForQualityAssurance
                            -> university -> id;

        //get the university of the application
        $applicationUniversity = $postGraduateProgramReviewApplication
                                -> postGraduateProgram
                                -> faculty
                                -> university -> id;

        if ($cqaUniversity != $applicationUniversity) {
            return Response::deny('You are not allowed to recommend this application');
        }

        //cqa director can only recommend applications that have status of 'submitted'
        if ($postGraduateProgramReviewApplication -> status != 'submitted') {
            return Response::deny('You are not allowed to recommend this application');
        }

        return Response::allow();
    }

    public function qacOfficerApprovalAuthorize(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): Response
    {
        //only qac officer can approve the application, but only if it is recommended

        $currUserRole = request() -> session() -> get('authRole');

        //since qac director is also a qac officer, we need to exclude him/her

        if ($currUserRole != 'qac_director' && $currUserRole != 'qac_officer') {
            return Response::deny('You are not allowed to approve or reject this application');
        }

        //only approves the applications that are applied
        if ($postGraduateProgramReviewApplication -> status == 'applied') {
            return Response::allow();
        }

        return Response::deny('You are not allowed to approve or reject this application');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): Response
    {
        //only dean can delete the application, but only if it is not submitted and he should be the same person who created the application
        $currUserRole = request() -> session() -> get('authRole');

        if ($currUserRole != 'dean') {
            return Response::deny('You are not allowed to delete this application');
        }

        //dean can only delete applications for pgps in his/her faculty (can be checked by dean_id as well)
        if($user -> id != $postGraduateProgramReviewApplication -> dean_id){
            return Response::deny('You are not allowed to delete this application');
        }

        //check the application status
        if($postGraduateProgramReviewApplication -> status == 'creating'){
            return Response::allow();
        }

        return Response::deny('You are not allowed to delete this application');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication): bool
    {
        //
    }
}
