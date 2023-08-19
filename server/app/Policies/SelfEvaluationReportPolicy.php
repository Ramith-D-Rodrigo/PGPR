<?php

namespace App\Policies;

use App\Models\SelfEvaluationReport;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SelfEvaluationReportPolicy
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
    public function view(User $user, SelfEvaluationReport $selfEvaluationReport): Response
    {
        //qac officer, qac director, reviewer cannot view selfEvaluationReport if the pgpr of the selfEvaluationReport
        //is in PLANNING stage

        $currRole = request() -> session() -> get('authRole');

        if($currRole == 'qac_officer' || $currRole == 'qac_director' || $currRole == 'reviewer'){
            if($selfEvaluationReport -> postGraduateProgramReview -> status == 'PLANNING'){
                return Response::deny('You cannot view this self evaluation report because the PGPR is in PLANNING stage');
            }
        }

        return Response::allow();
    }

    public function addAdherenceToStandardsAuthorize(User $user, SelfEvaluationReport $selfEvaluationReport): Response
    {
        //check whether self evaluation report is in PLANNING stage
        if($selfEvaluationReport -> postGraduateProgramReview -> status != 'PLANNING'){
            return Response::deny('You cannot add adherence to standards because the PGPR is not in PLANNING stage');
        }

        //only iqau director and programme coordinator can add adherence to standards
        $currRole = request() -> session() -> get('authRole');

        if(!in_array($currRole, ['iqau_director', 'programme_coordinator'])){
            return Response::deny('You are not authorized to add adherence to standards');
        }

        //iqau director can only add adherence to report if that report belongs to his faculty
        //programme coordinator can only add adherence to report if that report belongs to his postgraduate programme

        switch($currRole){
            case 'iqau_director':
                $iqauFaculty = $user -> universitySide -> qualityAssuranceStaff
                                    -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit
                                    -> faculty;

                if($selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram -> faculty_id != $iqauFaculty -> id){
                    return Response::deny('You are not authorized to add adherence to standards for this self evaluation report');
                }
                break;

            case 'programme_coordinator':
                $coordinatorPGP = $user -> universitySide -> academicStaff
                                    -> programmeCoordinator -> postGraduateProgram;

                if($selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram -> id != $coordinatorPGP -> id){
                    return Response::deny('You are not authorized to add adherence to standards for this self evaluation report');
                }
                break;
        }

        return Response::allow();
    }

    public function getStandardEvidencesAndAdherenceAuthorize(User $user, SelfEvaluationReport $selfEvaluationReport): Response
    {
        //reviewer, qac officer, qac director cannot get standard evidences and adherence if the pgpr of the selfEvaluationReport
        //is in PLANNING stage
        $currRole = request() -> session() -> get('authRole');

        if($currRole == 'qac_officer' || $currRole == 'qac_director' || $currRole == 'reviewer'){
            if($selfEvaluationReport -> postGraduateProgramReview -> status == 'PLANNING'){
                return Response::deny('You cannot get standard evidences and adherence because the PGPR is in PLANNING stage');
            }
        }

        return Response::allow();
    }

    public function submitSelfEvaluationReportAuthorize(User $user, SelfEvaluationReport $selfEvaluationReport): Response
    {
        //check whether self evaluation report is in PLANNING stage
        if($selfEvaluationReport -> postGraduateProgramReview -> status != 'PLANNING'){
            return Response::deny('You cannot submit self evaluation report because the PGPR is not in PLANNING stage');
        }

        //only programme coordinator can submit self evaluation report
        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'programme_coordinator'){
            return Response::deny('You are not authorized to submit self evaluation report');
        }

        //programme coordinator can only submit self evaluation report if that report belongs to his postgraduate programme
        $coordinatorPGP = $user -> universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram;

        if($selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram -> id != $coordinatorPGP -> id){
            return Response::deny('You are not authorized to submit self evaluation report for this self evaluation report');
        }

        return Response::allow();
    }

    public function recommendSelfEvaluationReportAuthorize(User $user, SelfEvaluationReport $selfEvaluationReport): Response
    {
        //check whether self evaluation report is in PLANNING stage
        if($selfEvaluationReport -> postGraduateProgramReview -> status != 'PLANNING'){
            return Response::deny('You cannot recommend self evaluation report because the PGPR is not in PLANNING stage');
        }

        //only iqau director, cqa_director and vice_chancellor can recommend self evaluation report
        $currRole = request() -> session() -> get('authRole');

        if(!in_array($currRole, ['iqau_director', 'cqa_director', 'vice_chancellor'])){
            return Response::deny('You are not authorized to recommend self evaluation report');
        }

        //iqau director can only recommend self evaluation report if that report belongs to his faculty
        //cqa director can only recommend self evaluation report if that report belongs to his university
        //vice chancellor can only recommend self evaluation report if that report belongs to his university

        switch($currRole){
            case 'iqau_director':
                $iqauFaculty = $user -> universitySide -> qualityAssuranceStaff
                                    -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit
                                    -> faculty;

                if($selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram -> faculty_id != $iqauFaculty -> id){
                    return Response::deny('You are not authorized to recommend self evaluation report for this self evaluation report');
                }
                break;

            case 'cqa_director':
                $cqaUniversity = $user -> universitySide -> qualityAssuranceStaff
                                    -> centerForQualityAssuranceDirector -> centerForQualityAssurance
                                    -> university;

                if($selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram -> university_id != $cqaUniversity -> id){
                    return Response::deny('You are not authorized to recommend self evaluation report for this self evaluation report');
                }
                break;

            case 'vice_chancellor':
                $viceChancellorUniversity = $user -> universitySide -> viceChancellor -> university;

                if($selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram -> university_id != $viceChancellorUniversity -> id){
                    return Response::deny('You are not authorized to recommend self evaluation report for this self evaluation report');
                }
                break;
        }

        return Response::allow();
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
    public function update(User $user, SelfEvaluationReport $selfEvaluationReport): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SelfEvaluationReport $selfEvaluationReport): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SelfEvaluationReport $selfEvaluationReport): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SelfEvaluationReport $selfEvaluationReport): bool
    {
        //
    }
}
