<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ViceChancellorResource extends JsonResource
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
            else{
                //convert to camel case
                $returnArr[Str::camel($key)] = $value;
            }
        }

        //include related data
        $returnArr['universitySide'] = new UniversitySideResource($this -> whenLoaded('universitySide'));

        return $returnArr;
    }
}
