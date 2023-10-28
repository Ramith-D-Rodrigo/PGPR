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
                $acceptedReviewTeam = $postGraduateProgramReview -> acceptedReviewTeam;
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

            case 'programme_coordinator':
                $programmeCoordinatorId = $user -> universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram -> id;
                if($postGraduateProgramReview -> postGraduateProgram -> id !== $programmeCoordinatorId){
                    return Response::deny('You are not authorized to view this postgraduate programme review');
                }
                return Response::allow();
                break;

            case 'iqau_director':
                $iqauDirectorFacultyId = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty -> id;
                if($postGraduateProgramReview -> postGraduateProgram -> faculty -> id !== $iqauDirectorFacultyId){
                    return Response::deny('You are not authorized to view this postgraduate programme review');
                }
                return Response::allow();
                break;

            case 'dean':
                $deanFacultyId = $user -> universitySide -> academicStaff -> dean -> faculty -> id;
                if($postGraduateProgramReview -> postGraduateProgram -> faculty -> id !== $deanFacultyId){
                    return Response::deny('You are not authorized to view this postgraduate programme review');
                }
                return Response::allow();
                break;

            case 'cqa_director':
                $cqaDirectorUniId = $user -> universitySide -> qualityAssuranceStaff -> centerForQualityAssuranceDirector -> centerForQualityAssurance -> university -> id;
                if($postGraduateProgramReview -> postGraduateProgram -> faculty -> university -> id !== $cqaDirectorUniId){
                    return Response::deny('You are not authorized to view this postgraduate programme review');
                }
                return Response::allow();
                break;

            case 'vice_chancellor':
                $viceChancellorUniId = $user -> universitySide -> viceChancellor -> university -> id;
                if($postGraduateProgramReview -> postGraduateProgram -> faculty -> university -> id !== $viceChancellorUniId){
                    return Response::deny('You are not authorized to view this postgraduate programme review');
                }
                return Response::allow();
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

}
