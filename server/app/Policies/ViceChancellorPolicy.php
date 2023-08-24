<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ViceChancellor;
use Illuminate\Auth\Access\Response;

class ViceChancellorPolicy
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
    public function view(User $user, ViceChancellor $viceChancellor): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only qac_officer can create vice chancellor
        //since qac_director is also a qac_officer, both roles are authorized

        $authRole = request() -> session() -> get('authRole');

        if($authRole == 'qac_officer' || $authRole == 'qac_director'){
            return Response::allow();
        }

        return Response::deny('You are not authorized to create a vice chancellor.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ViceChancellor $viceChancellor): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ViceChancellor $viceChancellor): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ViceChancellor $viceChancellor): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ViceChancellor $viceChancellor): bool
    {
        //
    }
}
