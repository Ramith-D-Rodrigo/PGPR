<?php

namespace App\Policies;

use App\Models\PostGraduateProgram;
use App\Models\ProgrammeCoordinator;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProgrammeCoordinatorPolicy
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
    public function view(User $user, ProgrammeCoordinator $programmeCoordinator): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only cqa director of the university can create a programme coordinator

        $currRole = request() -> session() -> get('authRole');

        if($currRole != 'cqa_director'){
            return Response::deny('You are not allowed to create a programme coordinator');
        }

        //check if the postgraduate programme id belongs to the university of the cqa director
        $postgraduateProgrammeId = request() -> post_grad_program_id;

        $postgraduateProgramme = PostGraduateProgram::find($postgraduateProgrammeId);

        $pgpUniId =  $postgraduateProgramme -> faculty -> university_id;

        $cqaDirectorUniId = $user -> universitySide -> university_id;

        if($pgpUniId != $cqaDirectorUniId){
            return Response::deny('You are not allowed to create a programme coordinator for a postgraduate programme that does not belong to your university');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProgrammeCoordinator $programmeCoordinator): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProgrammeCoordinator $programmeCoordinator): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ProgrammeCoordinator $programmeCoordinator): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ProgrammeCoordinator $programmeCoordinator): bool
    {
        //
    }
}
