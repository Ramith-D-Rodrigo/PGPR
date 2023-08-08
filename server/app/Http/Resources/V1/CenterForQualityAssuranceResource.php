<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CenterForQualityAssuranceResource extends JsonResource
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
        $returnArr['university'] = new UniversityResource($this -> whenLoaded('university'));
        $returnArr['director'] = new CenterForQualityAssuranceDirectorResource($this -> whenLoaded('centerForQualityAssuranceDirector'));

        return $returnArr;

    }
}
