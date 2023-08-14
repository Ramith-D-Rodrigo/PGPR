<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class PostGraduateProgramReviewResource extends JsonResource
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

        //convert snake case to camel case
        foreach($objProps as $key => $value){
            //ignore following keys from the response
            if(in_array($key, ['created_at', 'updated_at'])){
                continue;
            }
            if($key == 'id'){
                $value = "PGPR-{$value}";
            }

            $returnArr[Str::camel($key)] = $value;
        }

        //lazy load the following relationships
        $returnArr['postGraduateProgramme'] = new PostGraduateProgramResource($this -> whenLoaded('postGraduateProgram'));
        $returnArr['postGraduateProgramReviewApplication'] = new PostGraduateProgramReviewApplicationResource($this -> whenLoaded('postGraduateProgramReviewApplication'));
        return $returnArr;
    }
}
