<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CenterForQualityAssuranceDirectorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $returnArr = [];
        $objProps = $this -> getAttributes();

        foreach($objProps as $key => $value){
            if($key === 'created_at' || $key === 'updated_at'){
                continue;
            }
            //convert to camel case
            $returnArr[Str::camel($key)] = $value;
        }

        //include related data
        $returnArr['qualityAssuranceStaff'] = new QualityAssuranceStaffResource($this -> whenLoaded('qualityAssuranceStaff'));

        return $returnArr;
    }

}
