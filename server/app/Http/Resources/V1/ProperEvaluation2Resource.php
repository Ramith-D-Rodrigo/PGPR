<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProperEvaluation2Resource extends JsonResource
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
            'siteVisitStartDate' => $this->site_visit_start_date,
            'siteVisitEndDate' => $this->site_visit_end_date,
            'remark' => $this->remark,
        ];
    }
}
