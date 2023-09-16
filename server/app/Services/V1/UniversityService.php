<?php

namespace App\Services\V1;
use App\Models\CenterForQualityAssurance;
use App\Models\University;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class UniversityService {
    public static function create(array $validatedData): Model {
        //make sure the array has validated Data

        //add logged in qac_director_id to validated data
        $validatedData['quality_assurance_council_director_id'] = Auth::user() -> id; //user id is the qac director id (already authorized)

        //first create cqa entry
        //get the cqa details from the validated data (cqa prefix)
        $cqaDetails = [];
        foreach($validatedData as $key => $val){
            if(Str::startsWith($key, 'cqa_')){
                $cqaDetails[Str::after($key, 'cqa_')] = $val;
            }
        }

        $CQAid = CenterForQualityAssurance::create($cqaDetails) -> id; //create cqa and get its id
        //add the cqa id to the validated data
        $validatedData['center_for_quality_assurance_id'] = $CQAid;
        $universityModel = University::create($validatedData);

        return $universityModel;
    }

    public static function update(array $validatedData, University $universityModel): Model {
        //make sure the array has validated Data

        //first update cqa entry
        //get the cqa details from the validated data (cqa prefix)
        $cqaDetails = [];
        foreach($validatedData as $key => $val){
            if(Str::startsWith($key, 'cqa_')){
                $cqaDetails[Str::after($key, 'cqa_')] = $val;
            }
        }

        $universityModel -> centerForQualityAssurance -> update($cqaDetails); //update cqa
        $universityModel -> update($validatedData); //update university

        return $universityModel;
    }
}
