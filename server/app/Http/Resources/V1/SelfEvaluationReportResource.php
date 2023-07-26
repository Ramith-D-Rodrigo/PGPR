<?php

namespace App\Http\Resources\V1;

use App\Models\PostGraduateProgram;
use App\Models\ProgrammeCoordinator;
use App\Models\Standard;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class SelfEvaluationReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //first add the the attributes of the self evaluation report
        $returnArr = [];
        $objProps = $this -> getAttributes();

        foreach ($objProps as $key => $value) {
            if($key === 'created_at' || $key === 'updated_at'){
                continue;
            }

            //convert to camel case
            if($key === 'post_graduate_program_review_id'){ //prepend the PGPR- to value (prefix)
                $returnArr[Str::camel($key)] = 'PGPR-'. $key;
            }
            else{
                $returnArr[Str::camel($key)] = $value;
            }
        }

        //find the standards that are applicable to this SER of the pgp

        //get the pgp
        $pgp = ProgrammeCoordinator::find(['id' => $objProps['pgp_coordinator_id']]) -> postGraduateProgram;

        //get the slql level
        $slqf_level = $pgp -> slqf_level;

        //get all the standards that have this slqf level (or have the 'all' option)
        $standards = Standard::whereJsonContains('valid_slqf_levels', ['all', $slqf_level]) -> get();


        $returnArr['standards'] = new StandardCollection($standards);

        return $returnArr;
    }
}
