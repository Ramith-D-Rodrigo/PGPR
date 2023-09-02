<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProperEvaluationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pgprId' => $this->pgpr_id,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'stage' => $this->stage,
        ];
    }
}
