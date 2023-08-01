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

    //function to get applicable standards for a given slqf level and whether it is a professional pg programme
    public static function getApplicableStandards(int $slqfLevel, bool $isProffessionalPGProgramme): array {
        //we have to query the standards table to get the applicable standards
        $standards = Standard::all();
        $returnArr = [];

        foreach($standards as $standard){
            $applicableSLQFLevels = self::getApplicableSLQFLevels($standard);
            if(in_array($slqfLevel, $applicableSLQFLevels)){ //if the slqf level is applicable
                if(in_array("professionl_pg_programme", $applicableSLQFLevels)){ //if the standard is applicable for professional pg programmes
                    if($isProffessionalPGProgramme){ //if the programme is a professional pg programme
                        $returnArr[] = $standard; //add the standard to the return array
                    }
                }
                else{
                    $returnArr[] = $standard;
                }
            }
        }

        return $returnArr;
    }
}
