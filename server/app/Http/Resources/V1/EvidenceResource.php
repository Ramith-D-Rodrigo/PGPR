<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class EvidenceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //convert the snake case to camel case
        $objProps = $this -> getAttributes();

        $newArr = [];

        foreach($objProps as $key => $value){
            //convert applicable years to array using json_decode
            if($key == "applicable_years"){
                $value = json_decode($value);
            }

            if($key == "created_at" || $key == "updated_at"){
                //ignore created_at and updated_at
                continue;
            }

            $newArr[Str::camel($key)] = $value;
        }

        $pgprStatus = $this -> selfEvaluationReport[0] -> postGraduateProgramReview -> status_of_pgpr;

        if($pgprStatus == 'PLANNING'){
            //send the editing link url, not the storedUrl
            if(isset($newArr['storedUrl'])){
                unset($newArr['storedUrl']);
            }
        }
        else{
            if(isset($newArr['storedUrl'])){
                $newArr['url'] = $newArr['storedUrl'];
                unset($newArr['storedUrl']);
            }
        }

        return $newArr;
    }
}
