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

    public static function removeRole(CenterForQualityAssuranceDirector $cqaDirector) : bool {
        $user = $cqaDirector -> qualityAssuranceStaff -> universitySide -> user;

        //remove the role
        $roles = json_decode($user -> roles);
        $roles = array_diff($roles, ['cqa_director']);
        $user -> update(['roles' => json_encode(array_values($roles))]);

        //update the center for quality assurance director id in the center for quality assurance table (set it to null)
        $cqa = $cqaDirector -> centerForQualityAssurance;
        $cqa -> update(['center_for_quality_assurance_director_id' => null]);

        return true;
    }
}
