<?php

namespace App\Services\V1;

use App\Models\QualityAssuranceStaff;
use Illuminate\Database\Eloquent\Model;

class QualityAssuranceStaffService extends UniversitySideService {
    public static function create(array $validatedData) : Model {
        //make sure validatedData includes the status field and the roles field
        $universitySide = parent::create($validatedData); //call the parent create function to create the and get the university side model

        $qualityAssuranceStaff = new QualityAssuranceStaff();
        $qualityAssuranceStaff -> id = $universitySide -> id;
        $qualityAssuranceStaff -> fill($validatedData);

        $qualityAssuranceStaff -> save();

        return $qualityAssuranceStaff; //return the quality assurance staff object and the password (password for sending the email)
    }
}
