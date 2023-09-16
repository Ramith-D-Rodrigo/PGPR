<?php

namespace App\Services\V1;

use App\Models\Dean;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class DeanService extends AcademicStaffService{
    public static function create(array $validatedData) : Model {
        //make sure validated data has status, current_status fields, roles field

        $academicStaff = parent::create($validatedData);

        $dean = new Dean();
        $dean -> fill($validatedData);
        $dean -> id = $academicStaff -> id;
        $dean -> save();

        return $dean;
    }

    public static function removeRole(Dean $dean) : bool {
        $user = $dean -> academicStaff -> universitySide -> user;

        //remove the role
        $roles = json_decode($user -> roles);
        $roles = array_diff($roles, ['dean']);
        $user -> update(['roles' => json_encode(array_values($roles))]);

        //update the current status
        $dean -> update(['current_status' => 'INACTIVE']);

        //set the dean id of the faculty to null
        $faculty = $dean -> faculty;
        $faculty -> update(['dean_id' => null]);

        return true;
    }
}
