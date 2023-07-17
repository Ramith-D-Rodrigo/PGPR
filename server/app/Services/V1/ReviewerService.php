<?php

//this service class is used for services related to reviewer

namespace App\Services\V1;

use App\Models\Reviewer;
use App\Services\V1\AcademicStaffService;
use Illuminate\Database\Eloquent\Model;

class ReviewerService extends AcademicStaffService {
    public static function create(array $validatedData): Model{
        //make sure the validatedData includes the status field and the reviewer_status field and staff_position field
        $academicStaff = parent::create($validatedData); //call the parent create function to create the academic staff model
        $reviewer = new Reviewer();
        $reviewer -> fill($validatedData);
        $reviewer -> id = $academicStaff -> id;
        $reviewer -> save();

        return $reviewer; //return the reviewer object and the password (password for sending the email)
    }
}
