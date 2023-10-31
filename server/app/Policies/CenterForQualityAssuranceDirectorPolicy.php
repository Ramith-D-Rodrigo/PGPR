<?php

namespace App\Policies;

use App\Models\CenterForQualityAssuranceDirector;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CenterForQualityAssuranceDirectorPolicy
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
    public function view(User $user, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector): bool
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
    public function update(User $user, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector): bool
    {
        //
    }

    public function removeRole(User $user, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector): Response
    {
        //only qac_officer can remove the role of vice chancellor
        //since qac_director is also a qac_officer, both roles are authorized

        $authRole = request() -> session() -> get('authRole');

        if($authRole == 'qac_director'){
            //check if there is a pgpr that is currently being conducted in the university of the vice chancellor
            $pgprs = $centerForQualityAssuranceDirector -> centerForQualityAssurance -> university -> faculties -> map(function($faculty){
                return $faculty -> postGraduatePrograms -> map(function($pgp){
                    return $pgp -> postGraduateProgramReviews;
                });
            }) -> flatten();


            $pgprs = $pgprs -> filter(function($pgpr){
                return $pgpr -> status_of_pgpr != 'COMPLETED' && $pgpr -> status_of_pgpr != 'SUSPENDED';
            });

            if($pgprs -> count() > 0){
                return Response::deny('You cannot remove the role of CQA director because there is currently a review being conducted in the university');
            }

            return Response::allow();
        }

        return Response::deny('You are not authorized to remove the role of a CQA director.');
    }
}
