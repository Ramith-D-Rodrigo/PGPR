<?php

namespace App\Policies;

use App\Models\Dean;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Auth;

class DeanPolicy
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
    public function view(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        //only cqa director can create dean
        $currentRole = request() -> session() -> get('AuthRole');

        if($currentRole != 'cqa director'){
            return Response::deny('You are not allowed to create a dean account');
        }

        //cqa director can only create dean account to faculty that is belong to the university of the cqa director

        $cqaUniversity = Auth::user() -> universitySide -> university_id;

        $deanFaculty = request() -> faculty_id;

        $deanUniversity = Faculty::find($deanFaculty) -> university_id;

        if($cqaUniversity != $deanUniversity){
            return Response::deny('You are not allowed to create a dean account to this faculty');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Dean $dean): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Dean $dean): bool
    {
        //
    }
}
