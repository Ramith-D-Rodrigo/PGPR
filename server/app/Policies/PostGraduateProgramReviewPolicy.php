<?php

namespace App\Policies;

use App\Models\PostGraduateProgramReview;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostGraduateProgramReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        //only qac_director and qac_officer has access to this endpoint
        $currRole = request() -> session() -> get('authRole');

        switch($currRole){
            case 'qac_director':
            case 'qac_officer':
                return Response::allow();
                break;
            default:
                return Response::deny('You are not authorized to view postgraduate programme reviews');
        }
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PostGraduateProgramReview $postGraduateProgramReview): Response
    {
        //only qac_director and qac_officer, reviewer who is part of the accepted review team of pgpr has access to this endpoint
        $currRole = request() -> session() -> get('authRole');

        switch($currRole){
            case 'qac_director':
            case 'qac_officer':
                return Response::allow();
                break;

            case 'reviewer':
                $reviewerId = $user -> id;
                $acceptedReviewTeam = $postGraduateProgramReview -> acceptedReviewTeam();
                if($acceptedReviewTeam !== null){
                    $reviewers = $acceptedReviewTeam -> reviewers;
                    foreach($reviewers as $reviewer){
                        if($reviewer -> id === $reviewerId){
                            return Response::allow();
                        }
                    }
                }
                return Response::deny('You are not authorized to view this postgraduate programme review');
                break;
                
            default:
                return Response::deny('You are not authorized to view this postgraduate programme review');
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PostGraduateProgramReview $postGraduateProgramReview): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PostGraduateProgramReview $postGraduateProgramReview): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PostGraduateProgramReview $postGraduateProgramReview): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PostGraduateProgramReview $postGraduateProgramReview): bool
    {
        //
    }


    public function authorizeReviews(User $user, PostGraduateProgramReview $postGraduateProgramReview): Response
    {
        //get curr logged in role from session
        $currRole = request() -> session() -> get('authRole');

        //programme_coordinator can only view reviews of the postgraduate programme they are coordinating
        //dean can only view reviews of the postgraduate programme of the faculty they are dean of
        //vice chancellor can view all reviews of all postgraduate programmes of their university
        //reviewer cannot use this endpoint
        //cqa_director can view all reviews of all postgraduate programmes of their university
        //iqau_director can view all reviews of all postgraduate programmes of their university
        //qac_director and qac_officer can view all the reviews

        switch($currRole){
            case 'programme_coordinator':
                $coordinatorPGPId = $user -> universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram -> id;
                if($coordinatorPGPId !== $postGraduateProgramReview -> postGraduateProgram -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme you are coordinating');
                }
                break;
            case 'dean':
                $deanFacultyId = $user -> universitySide -> academicStaff -> dean -> faculty -> id;
                if($deanFacultyId !== $postGraduateProgramReview -> postGraduateProgram -> faculty -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme of the faculty you are dean of');
                }
                break;
            case 'vice_chancellor':
                $vcUniId = $user -> universitySide -> viceChancellor -> university -> id;
                if($vcUniId !== $postGraduateProgramReview -> postGraduateProgram -> faculty -> university ->  id){
                    return Response::deny('You can only view reviews of the postgraduate programme of your university');
                }
                break;
            case 'cqa_director':
                $cqaUniId = $user -> universitySide
                                -> qualityAssuranceStaff -> centerForQualityAssuranceDirector
                                -> centerForQualityAssurance -> university -> id;

                if($cqaUniId !== $postGraduateProgramReview -> postGraduateProgram -> university -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme of your university');
                }
                break;
            case 'iqau_director':
                $iqauFacultyId = $user -> universitySide
                                -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector
                                -> internalQualityAssuranceUnit -> faculty -> id;
                if($iqauFacultyId !== $postGraduateProgramReview -> postGraduateProgram -> faculty -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme of your faculty');
                }
                break;
            case 'qac_director':
            case 'qac_officer':
                return Response::allow();
                break;

            default:
                return Response::deny('You are not authorized to view reviews of postgraduate programmes');
        }

        return Response::allow();
    }
}
