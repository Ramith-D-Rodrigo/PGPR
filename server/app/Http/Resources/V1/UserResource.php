<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class UserResource extends JsonResource
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
            if(in_array($key, ['password', 'remember_token', 'created_at', 'updated_at'])){
                continue;
            }

            $returnArr[Str::camel($key)] = $value;
        }

        return $returnArr;
    }
}
