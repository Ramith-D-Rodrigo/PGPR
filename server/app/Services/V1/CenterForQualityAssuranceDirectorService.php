<?php

namespace App\Services\V1;

use App\Models\CenterForQualityAssuranceDirector;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CenterForQualityAssuranceDirectorService extends QualityAssuranceStaffService {
    public static function create(array $validatedData) : Model {
        //make sure validated data has status field and the roles field

        $qualityAssuranceStaff = parent::create($validatedData); //call the parent create function to create the quality assurance staff model

        $CQADirector = new CenterForQualityAssuranceDirector();
        $CQADirector -> id = $qualityAssuranceStaff -> id;
        $CQADirector -> fill($validatedData);

        $CQADirector -> save();

        return $CQADirector; //return the cqa director model
    }
}
