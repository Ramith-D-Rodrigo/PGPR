<?php

namespace App\Http\Resources\V1;

use App\Models\Criteria;
use App\Models\PostGraduateProgram;
use App\Models\ProgrammeCoordinator;
use App\Models\Standard;
use App\Services\V1\StandardService;
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
            if($key === 'post_graduate_program_review_id'){ //prepend the PGPR- to value (prefix) (moved this to pgpr resource)
                continue;
            }
            else{
                $returnArr[Str::camel($key)] = $value;
            }
        }

        //lazy loaded relations
        $returnArr['postGraduateProgramReview'] = new PostGraduateProgramReviewResource($this -> whenLoaded('postGraduateProgramReview'));

        //find the standards that are applicable to this SER of the pgp
        $slqf_level = $returnArr['postGraduateProgramReview'] -> postGraduateProgram -> slqf_level;
        //get all the standards that have this slqf level (or have the 'all' option)
        $standards = StandardService::getApplicableStandards($slqf_level, false);

        //load the criteria and standards that is applicable to this SER
        $returnArr['criterias'] = new CriteriaCollection(Criteria::with(['standards' => function($query) use ($standards){
            $query -> whereIn('id', array_column($standards, 'id'));
        }]) -> get());

        //load the standards that have given evidence
        $returnArr['evidenceGivenStandards'] = new StandardCollection($this -> whenLoaded('standards'));
        return $returnArr;
    }
}
