<?php

namespace App\Policies;

use App\Http\Requests\V1\StorePostGraduateProgramRequest;
use App\Models\Faculty;
use App\Models\PostGraduateProgram;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostGraduateProgramPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PostGraduateProgram $postGraduateProgram): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, StorePostGraduateProgramRequest $request): Response
    {
        //only cqa director of a univeristy can create

        //get auth role from the from the request session
        $authRole = request() -> session() -> get('authRole');

        //check if the auth role is cqa director
        if($authRole != 'cqa_director'){
            return Response::deny('You are not authorized to create a post graduate program');
        }

        //check if cqa director's university is the same as the university of the post graduate program

        //request has the faculty id
        //have to find the faculty from the faculty id
        $faculty = Faculty::find($request -> faculty_id);

        //compare the univeristy of the faculty with the university of the cqa director
        if($faculty -> university_id != $user -> universitySide
                                            -> qualityAssuranceStaff
                                            -> centerForQualityAssuranceDirector
                                            -> centerForQualityAssurance
                                            -> university
                                            -> id){
            return Response::deny('You do not belong to the same university as the faculty you are trying to create a post graduate program for');
        }

        //authorized
        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PostGraduateProgram $postGraduateProgram): Response
    {
        //only cqa director of a univeristy can update

        //get auth role from the from the request session
        $authRole = request() -> session() -> get('authRole');

        //check if the auth role is cqa director
        if($authRole != 'cqa_director'){
            return Response::deny('You are not authorized to update a post graduate program');
        }

        //check if cqa director's university is the same as the university of the post graduate program

        //check the university of the post graduate program
        if($postGraduateProgram -> faculty -> university_id != $user -> universitySide
                                                                    -> qualityAssuranceStaff
                                                                    -> centerForQualityAssuranceDirector
                                                                    -> centerForQualityAssurance
                                                                    -> university
                                                                    -> id){
            return Response::deny('You do not belong to the same university as the post graduate program you are trying to update');
        }

        //authorized
        return Response::allow();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PostGraduateProgram $postGraduateProgram): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PostGraduateProgram $postGraduateProgram): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PostGraduateProgram $postGraduateProgram): bool
    {
        //
    }

    public function authorizeReviews(User $user, PostGraduateProgram $postGraduateProgram): Response
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
                if($coordinatorPGPId !== $postGraduateProgram -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme you are coordinating');
                }
                break;
            case 'dean':
                $deanFacultyId = $user -> universitySide -> academicStaff -> dean -> faculty -> id;
                if($deanFacultyId !== $postGraduateProgram -> faculty -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme of the faculty you are dean of');
                }
                break;
            case 'vice_chancellor':
                $vcUniId = $user -> universitySide -> viceChancellor -> university -> id;
                if($vcUniId !== $postGraduateProgram -> faculty -> university ->  id){
                    return Response::deny('You can only view reviews of the postgraduate programme of your university');
                }
                break;
            case 'cqa_director':
                $cqaUniId = $user -> universitySide
                                -> qualityAssuranceStaff -> centerForQualityAssuranceDirector
                                -> centerForQualityAssurance -> university -> id;

                if($cqaUniId !== $postGraduateProgram -> faculty -> university -> id){
                    return Response::deny('You can only view reviews of the postgraduate programme of your university');
                }
                break;
            case 'iqau_director':
                $iqauFacultyId = $user -> universitySide
                                -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector
                                -> internalQualityAssuranceUnit -> faculty -> id;
                if($iqauFacultyId !== $postGraduateProgram -> faculty -> id){
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
