<?php

namespace App\Policies;

use App\Models\Evidence;
use App\Models\SelfEvaluationReport;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EvidencePolicy
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
    public function view(User $user, Evidence $evidence): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only programme coordinator and internal quality assurance officer can create evidence
        //only need to check whether these roles belong to the particular post graduate program review

        $currRole = request() -> session() -> get('authRole');

        if(!in_array($currRole, ['programme_coordinator','iqau_director'])){
            return Response::deny('You are not allowed to create evidence');
        }

        //get the ser id from the request
        $SERid = request() -> self_evaluation_report_id;

        //find the faculty from the ser id
        $faculty = SelfEvaluationReport::findOrFail($SERid)
                                            -> postGraduateProgramReview
                                            -> postGraduateProgram
                                            -> faculty;

        switch($currRole){
            case 'programme_coordinator':

                $coordinatorFaculty = $user
                                        -> universitySide -> academicStaff
                                        -> programmeCoordinator -> postGraduateProgram
                                        -> faculty;

                if($coordinatorFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to create evidence');
                }

                break;

            case 'iqau_director':

                $iqauFaculty = $user
                                    -> universitySide -> qualityAssuranceStaff
                                    -> internalQualityAssuranceUnitDirector
                                    -> internalQualityAssuranceUnit
                                    -> faculty;

                if($iqauFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to create evidence');
                }

                break;
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Evidence $evidence): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Evidence $evidence): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Evidence $evidence): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Evidence $evidence): Response
    {
        //only programme coordinator and internal quality assurance officer can delete evidence
        //only need to check whether these roles belong to the particular post graduate program review

        $currRole = request() -> session() -> get('authRole');

        if(!in_array($currRole, ['programme_coordinator','iqau_director'])){
            return Response::deny('You are not allowed to create evidence');
        }

        //find the faculty from the evidence
        $faculty = $evidence
                        -> selfEvaluationReport
                        -> postGraduateProgramReview
                        -> postGraduateProgram
                        -> faculty;
                        
        switch($currRole){
            case 'programme_coordinator':

                $coordinatorFaculty = $user
                                        -> universitySide -> academicStaff
                                        -> programmeCoordinator -> postGraduateProgram
                                        -> faculty;

                if($coordinatorFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to create evidence');
                }

                break;

            case 'iqau_director':

                $iqauFaculty = $user
                                    -> universitySide -> qualityAssuranceStaff
                                    -> internalQualityAssuranceUnitDirector
                                    -> internalQualityAssuranceUnit
                                    -> faculty;

                if($iqauFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to create evidence');
                }

                break;
        }

        return Response::allow();
    }
}