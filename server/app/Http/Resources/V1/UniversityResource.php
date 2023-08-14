<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class UniversityResource extends JsonResource
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
            if($key === 'contact_no' || $key === 'fax_no'){
                $value = json_decode($value, true);
            }

            $returnArr[Str::camel($key)] = $value;
        }

        //include related data
        $returnArr['centerForQualtyAssurance'] = new CenterForQualityAssuranceResource($this -> whenLoaded('centerForQualityAssurance'));
        $returnArr['viceChancellor'] = new ViceChancellorResource($this -> whenLoaded('viceChancellor'));

        return $returnArr;
    }
}
