<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class FacultyResource extends JsonResource
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
            //ignore following keys from the response
            if(in_array($key, ['created_at', 'updated_at'])){
                continue;
            }

            $returnArr[Str::camel($key)] = $value;
        }

        $returnArr['university'] = new UniversityResource($this -> whenLoaded('university'));
        $returnArr['internalQualityAssuranceUnit'] = new InternalQualityAssuranceUnitResource($this -> whenLoaded('internalQualityAssuranceUnit'));
        $returnArr['dean'] = new DeanResource($this -> whenLoaded('dean'));

        return $returnArr;
    }
}
