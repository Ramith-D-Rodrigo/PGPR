<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewTeamResource extends JsonResource
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
            'status' => $this->status,
            'deanDecision' => $this->dean_decision ?? "The dean is yet to make a decision on this review team",
            'deanRemark' => $this->dean_remark ?? "The dean have not yet provided a comment about this review team",
            'reviewers' => new ReviewerCollection($this->whenLoaded('reviewers'))
        ];
    }
}
