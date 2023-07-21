<?php

namespace App\Services\V1;

use App\Models\ProgrammeCoordinator;
use Illuminate\Database\Eloquent\Model;

class ProgrammeCoordinatorService extends AcademicStaffService{
    public static function create(array $validatedData): Model {
        //make sure validated data has status, staff_position and current_status fields, roles field

        $academicStaff = parent::create($validatedData);

        $programmeCoordinator = new ProgrammeCoordinator();
        $programmeCoordinator -> fill($validatedData);
        $programmeCoordinator -> id = $academicStaff -> id;
        $programmeCoordinator -> save();

        return $programmeCoordinator;
    }
}
