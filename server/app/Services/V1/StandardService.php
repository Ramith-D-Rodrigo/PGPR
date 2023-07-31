<?php

namespace App\Services\V1;

use App\Models\Standard;

class StandardService {
    public static function getApplicableSLQFLevels(Standard $standard): array {
        $applicableSLQFLevels = json_decode($standard -> valid_slqf_levels); //decode the json string to an array
        $returnArr = [];
        if(in_array("all", $applicableSLQFLevels)){ //if has all, then all slqf levels are applicable
            $returnArr = [7,8,9,10,11,12];
        }
        else{
            $returnArr = array_map('intval', $applicableSLQFLevels);
        }

        //check for professional pg programs
        if(in_array("professionl_pg_programme", $applicableSLQFLevels)){
            $returnArr = array_merge($returnArr, ["professionl_pg_programme"]);
        }

        return $returnArr;
    }
}
