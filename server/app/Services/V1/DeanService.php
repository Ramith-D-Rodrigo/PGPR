<?php

namespace App\Services\V1;

use App\Models\Dean;
use Illuminate\Database\Eloquent\Model;

class DeanService extends AcademicStaffService{
    public static function create(array $validatedData) : Model {
        //make sure validated data has status, staff_position and current_status fields, roles field
        $academicStaff = parent::create($validatedData);

        $dean = new Dean();
        $dean -> fill($validatedData);
        $dean -> id = $academicStaff -> id;
        $dean -> save();

        return $dean;
    }
}
