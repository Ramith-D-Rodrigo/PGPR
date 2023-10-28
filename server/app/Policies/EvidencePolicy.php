<?php

namespace App\Policies;

use App\Http\Requests\V1\StoreEvidenceRequest;
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
    public function create(User $user, StoreEvidenceRequest $request): Response
    {
        //only programme coordinator and internal quality assurance officer can create evidence
        //only need to check whether these roles belong to the particular post graduate program review

        $currRole = request() -> session() -> get('authRole');

        if(!in_array($currRole, ['programme_coordinator','iqau_director'])){
            return Response::deny('You are not allowed to create evidence');
        }
        //get the ser id from the request
        $SERid = $request -> self_evaluation_report_id;

        //find the faculty from the ser id
        $SER = SelfEvaluationReport::findOrFail($SERid);

        //can only create evidence at the planning stage
        if($SER -> postGraduateProgramReview -> status_of_pgpr !== 'PLANNING'){
            return Response::deny('You are not allowed to create evidence at this stage');
        }



        $faculty = $SER -> postGraduateProgramReview -> postGraduateProgram -> faculty;

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
    public function update(User $user, Evidence $evidence): Response
    {
        //only programme coordinator and internal quality assurance officer can update evidence
        //only need to check whether these roles belong to the particular post graduate program review

        $currRole = request() -> session() -> get('authRole');

        if(!in_array($currRole, ['programme_coordinator','iqau_director'])){
            return Response::deny('You are not allowed to update evidence');
        }

        //can only update evidence at the planning stage
        if($evidence -> selfEvaluationReport[0] -> postGraduateProgramReview -> status_of_pgpr !== 'PLANNING'){
            return Response::deny('You are not allowed to update evidence at this stage');
        }

        //find the faculty from the evidence
        $faculty = $evidence -> selfEvaluationReport[0] -> postGraduateProgramReview -> postGraduateProgram -> faculty;

        switch($currRole){
            case 'programme_coordinator':

                $coordinatorFaculty = $user
                                        -> universitySide -> academicStaff
                                        -> programmeCoordinator -> postGraduateProgram
                                        -> faculty;

                if($coordinatorFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to update evidence');
                }

                break;

            case 'iqau_director':

                $iqauFaculty = $user
                                    -> universitySide -> qualityAssuranceStaff
                                    -> internalQualityAssuranceUnitDirector
                                    -> internalQualityAssuranceUnit
                                    -> faculty;

                if($iqauFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to update evidence');
                }

                break;
        }

        return Response::allow();
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
            return Response::deny('You are not allowed to delete evidence');
        }

        //can only delete evidence at the planning stage
        if($evidence -> selfEvaluationReport[0] -> postGraduateProgramReview -> status_of_pgpr !== 'PLANNING'){
            return Response::deny('You are not allowed to delete evidence at this stage');
        }

        //find the faculty from the evidence
        $faculty = $evidence
                        -> selfEvaluationReport[0] //only one should be there
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
                    return Response::deny('You are not allowed to delete evidence');
                }

                break;

            case 'iqau_director':

                $iqauFaculty = $user
                                    -> universitySide -> qualityAssuranceStaff
                                    -> internalQualityAssuranceUnitDirector
                                    -> internalQualityAssuranceUnit
                                    -> faculty;

                if($iqauFaculty -> id != $faculty -> id){
                    return Response::deny('You are not allowed to delete evidence');
                }

                break;
        }

        return Response::allow();
    }
}
