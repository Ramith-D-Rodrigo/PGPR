<?php

namespace App\Policies;

use App\Models\Reviewer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReviewerPolicy
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
    public function view(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only qac_officer can create reviewer
        //since qac_director is also a qac_officer, qac_director can also create reviewer

        $currRole = request() -> session() -> get('authRole');

        if ($currRole == 'qac_officer' || $currRole == 'qac_director') {
            return Response::allow();
        } else {
            return Response::deny('You are not allowed to create reviewer.');
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Reviewer $reviewer): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Reviewer $reviewer): bool
    {
        //
    }
}
