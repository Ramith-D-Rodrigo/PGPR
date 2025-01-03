<?php

namespace App\Policies;

use App\Models\AcademicStaff;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AcademicStaffPolicy
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
    public function view(User $user, AcademicStaff $academicStaff): bool
    {
        //
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
    public function update(User $user, AcademicStaff $academicStaff): Response
    {
        //only the academic staff can update their own profile
        return $user -> id === $academicStaff -> id
            ? Response::allow()
            : Response::deny('You are not authorized to update this academic staff profile.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AcademicStaff $academicStaff): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AcademicStaff $academicStaff): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AcademicStaff $academicStaff): bool
    {
        //
    }
}
