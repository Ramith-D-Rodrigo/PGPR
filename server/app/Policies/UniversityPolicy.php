<?php

namespace App\Policies;

use App\Models\University;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UniversityPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //anyone can view a university
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, University $university): bool
    {
        //anyone can view a university
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only current logged in qac director can create a university
        //get the authRole in the request session
        $authRole = request() -> session() -> get('authRole');

        if($authRole == 'qac_director'){
            return Response::allow();
        }

        return Response::deny('You are not authorized to create a university.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, University $university): Response
    {
        //only current logged in qac director can update a university

        //get the authRole in the request session
        $authRole = request() -> session() -> get('authRole');

        if($authRole == 'qac_director'){
            return Response::allow();
        }

        return Response::deny('You are not authorized to update this university.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, University $university): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, University $university): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, University $university): bool
    {
        //
    }
}
