<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AcademicStaffResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $objProps = $this -> getAttributes();
        $returnArr = [];

        //json properties
        $jsonProps = [
            'experienceInIndustry',
            'googleScholarLink',
            'nominees',
            'department',
            'experienceWithResearchFunds',
            'involvementInInternalQualityAssurance',
            'involvementInStudyProgrammeDevelopment',
            'postgraduateTeachingExperience',
            'postgraduateQualifications',
            'priorTrainingInProgrammeReview'
        ];

        foreach($objProps as $key => $value){
            //convert snake case to camel case
            if($key === 'created_at' || $key === 'updated_at'){
                continue;
            }
            else{
                if(in_array(Str::camel($key), $jsonProps)){
                    $returnArr[Str::camel($key)] = json_decode($value);
                }
                else{
                    $returnArr[Str::camel($key)] = $value;
                }
            }
        }

        //related data
        $returnArr['universitySide'] = new universitySideResource($this -> whenLoaded('universitySide'));

        return $returnArr;
    }
}
