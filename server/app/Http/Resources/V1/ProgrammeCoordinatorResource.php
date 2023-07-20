<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ProgrammeCoordinatorResource extends JsonResource
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
            //convert snake case to camel case
            if($key === 'created_at' || $key === 'updated_at'){
                continue;
            }
            else{
                $returnArr[Str::camel($key)] = $value;
            }
        }

        return $returnArr;
    }
}
