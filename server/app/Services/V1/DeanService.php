<?php

namespace App\Services\V1;

use App\Models\Dean;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class DeanService extends AcademicStaffService{
    public static function create(array $validatedData) : Model {
        //make sure validated data has status, current_status fields, roles field

        //authorized cqa director id
        $validatedData['created_by'] = Auth::user() -> id;

        $academicStaff = parent::create($validatedData);

        $dean = new Dean();
        $dean -> fill($validatedData);
        $dean -> id = $academicStaff -> id;
        $dean -> save();

        return $dean;
    }
}
