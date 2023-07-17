<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriveFileInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $returnArr = [];
        $obj = json_decode($this -> resource, true);
        foreach($obj as $key => $value) {
            //ignore null values
            if(empty($value)){
                continue;
            }
            $returnArr[$key] = $value;
        }

        return $returnArr;
    }
}
