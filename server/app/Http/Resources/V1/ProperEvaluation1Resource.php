<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProperEvaluation1Resource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'properEvaluationPhase1MeetingDate' => $this->pe_1_meeting_date,
            'remark' => $this->remark,
        ];
    }
}
