<?php

namespace App\Policies;

use App\Models\Faculty;
use App\Models\InternalQualityAssuranceUnitDirector;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InternalQualityAssuranceUnitDirectorPolicy
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
    public function view(User $user, InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only cqa director of the university can create an internal quality assurance unit director
        $currRole = request()->session()->get('authRole');

        if ($currRole != 'cqa_director') {
            return Response::deny('You are not allowed to create an internal quality assurance unit director');
        }

        //check if the internal quality assurance unit id belongs to the university of the cqa director
        $facultyId = request() -> faculty_id;

        $faculty = Faculty::find($facultyId);

        $cqaUniId = $user -> universitySide -> university_id;

        if ($faculty -> university_id != $cqaUniId) {
            return Response::deny('You are not allowed to create an internal quality assurance unit director for a faculty that does not belong to your university');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector): bool
    {
        //
    }
}
