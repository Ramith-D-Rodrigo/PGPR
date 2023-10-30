<?php

namespace App\Policies;

use App\Models\UniversitySide;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UniversitySidePolicy
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
    public function view(User $user, UniversitySide $universitySide): bool
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
    public function update(User $user, UniversitySide $universitySide): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UniversitySide $universitySide): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UniversitySide $universitySide): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UniversitySide $universitySide): bool
    {
        //
    }


    public function assignReviewerRoleAuthorize(User $user, UniversitySide $universitySide) : Response {
        //only qac officer and qac director is authorize

        $currRole = request() -> session() -> get('authRole');

        if($currRole == 'qac_officer' || $currRole == 'qac_director'){
            return Response::allow();
        }

        return Response::deny("You are not allowed to perform this action");
    }
}
