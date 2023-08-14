<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class InternalQualityAssuranceUnitResource extends JsonResource
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
            //ignore following keys from the response
            if(in_array($key, ['created_at', 'updated_at'])){
                continue;
            }

            //decode json data of contact_no and fax_no
            if(in_array($key, ['contact_no', 'fax_no'])){
                $value = json_decode($value);
            }

            $returnArr[Str::camel($key)] = $value;
        }

        return $returnArr;
    }
}
