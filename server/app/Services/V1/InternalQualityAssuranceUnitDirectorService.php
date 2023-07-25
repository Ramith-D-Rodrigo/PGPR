<?php

namespace App\Services\V1;

use App\Models\QualityAssuranceStaff;
use Illuminate\Database\Eloquent\Model;
use App\Models\InternalQualityAssuranceUnitDirector;


class InternalQualityAssuranceUnitDirectorService extends QualityAssuranceStaffService {

    public static function create(array $validateData) : Model {
        //make sure validated data has status field
        $qualityAssuranceStaff = parent::create($validateData); //call the parent create function to create the quality assurance staff model

        $internalQualityAssuranceUnitDirector = new InternalQualityAssuranceUnitDirector();
        $internalQualityAssuranceUnitDirector -> id = $qualityAssuranceStaff -> id;
        $internalQualityAssuranceUnitDirector -> fill($validateData);

        $internalQualityAssuranceUnitDirector -> save();

        return $internalQualityAssuranceUnitDirector; //return the internal quality assurance unit director object
    }
}
