<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostGraduateProgramResource extends JsonResource
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
            if(in_array($key, ['created_at', 'updated_at', 'added_by_cqa_director_id', 'edited_by_cqa_director_id'])){
                continue;
            }

            $returnArr[$key] = $value;
        }

        return $returnArr;
    }
}
