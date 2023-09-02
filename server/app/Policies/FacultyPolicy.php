<?php

namespace App\Policies;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FacultyPolicy
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
    public function view(User $user, Faculty $faculty): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only cqa director of the university can create a faculty

        //get the logged in role from the request session
        $authRole = request() -> session() -> get('authRole');

        //check if the logged in user is a cqa director
        if ($authRole == 'cqa_director') {
            return Response::allow();
        } else {
            return Response::deny('You are not authorized to create a faculty');
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Faculty $faculty): Response
    {
        //only cqa director of the university can update a faculty

        //get the logged in role from the request session
        $authRole = request() -> session() -> get('authRole');

        //check if the logged in user is a cqa director
        if ($authRole != 'cqa_director') {
            return Response::deny('You are not authorized to update a faculty');
        }

        //check whether the faculty belongs to the university of the cqa director
        $cqaDirectorUniId = $user -> universitySide -> university_id;

        if ($faculty -> university_id != $cqaDirectorUniId) {
            return Response::deny('You are not authorized to update a faculty of another university');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Faculty $faculty): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Faculty $faculty): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Faculty $faculty): bool
    {
        //
    }
}
