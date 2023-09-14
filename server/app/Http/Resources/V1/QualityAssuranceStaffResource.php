<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class QualityAssuranceStaffResource extends JsonResource
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

        //convert to camel case
        foreach($objProps as $key => $value){
            if($key === 'created_at' || $key === 'updated_at'){
                continue;
            }
            else{
                if($key === 'contact_no' || $key === 'fax_no'){
                    $value = json_decode($value, true);
                }

                $returnArr[Str::camel($key)] = $value;
            }
        }

        //include related data

        //include university side
        $returnArr['universitySide'] = new UniversitySideResource($this -> whenLoaded('universitySide'));

        return $returnArr;
    }
}
