<?php

namespace App\Services\V1;

use App\Models\QualityAssuranceStaff;
use Illuminate\Database\Eloquent\Model;
use App\Models\InternalQualityAssuranceUnitDirector;


class InternalQualityAssuranceUnitDirectorService extends QualityAssuranceStaffService {

    public static function create(array $validateData) : Model {
        //make sure validated data has status field and the roles field
        $qualityAssuranceStaff = parent::create($validateData); //call the parent create function to create the quality assurance staff model

        $internalQualityAssuranceUnitDirector = new InternalQualityAssuranceUnitDirector();
        $internalQualityAssuranceUnitDirector -> id = $qualityAssuranceStaff -> id;
        $internalQualityAssuranceUnitDirector -> fill($validateData);

        $internalQualityAssuranceUnitDirector -> save();

        return $internalQualityAssuranceUnitDirector; //return the internal quality assurance unit director object
    }

    public static function removeRole(InternalQualityAssuranceUnitDirector $iqauDirector) : bool{
        $user = $iqauDirector -> qualityAssuranceStaff -> universitySide -> user;

        //remove the role
        $roles = json_decode($user -> roles);
        $roles = array_diff($roles, ['iqau_director']);
        $user -> update(['roles' => json_encode(array_values($roles))]);

        //update the internal quality assurance unit director id in the internal quality assurance unit table (set it to null)
        $iqau = $iqauDirector -> internalQualityAssuranceUnit;
        $iqau -> update(['iqau_dir_id' => null]);

        return true;
    }
}
