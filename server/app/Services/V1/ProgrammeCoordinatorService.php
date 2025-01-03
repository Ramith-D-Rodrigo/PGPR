<?php

namespace App\Services\V1;

use App\Models\ProgrammeCoordinator;
use Illuminate\Database\Eloquent\Model;

class ProgrammeCoordinatorService extends AcademicStaffService{
    public static function create(array $validatedData): Model {
        //make sure validated data has status, current_status fields, roles field

        $academicStaff = parent::create($validatedData);

        $programmeCoordinator = new ProgrammeCoordinator();
        $programmeCoordinator -> fill($validatedData);
        $programmeCoordinator -> id = $academicStaff -> id;
        $programmeCoordinator -> save();

        return $programmeCoordinator;
    }

    public static function removeRole(ProgrammeCoordinator $pgpCoordinator) : bool {
        $user = $pgpCoordinator -> academicStaff -> universitySide -> user;
        //remove the role
        $roles = json_decode($user -> roles);

        $roles = array_diff($roles, ['programme_coordinator']);

        $user -> update(['roles' => json_encode(array_values($roles))]);

        //update the status of the programme coordinator
        $pgpCoordinator -> update(['current_status' => 'INACTIVE']);

        //set the programme coordinator id of the post graduate programme to null
        $pgp = $pgpCoordinator -> postGraduateProgram;
        $pgp -> update(['programme_coordinator_id' => null]);

        return true;
    }
}
