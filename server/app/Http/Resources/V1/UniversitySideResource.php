<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class UniversitySideResource extends JsonResource
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
            //convert snake case to camel case
            if($key === 'created_at' || $key === 'updated_at'){
                continue;
            }
            else{
                $returnArr[Str::camel($key)] = $value;
            }
        }

        //related data
        $returnArr['user'] = new UserResource($this -> whenLoaded('user'));
        return $returnArr;
    }
}
