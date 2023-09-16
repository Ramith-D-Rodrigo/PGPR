<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewerBrowsePGPRResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'postGraduateReviewProgram' => new PostGraduateProgramReviewResource($this->whenLoaded('postGraduateReviewProgram')),
            'postGraduateProgram' => new PostGraduateProgramResource($this->whenLoaded('postGraduateReviewProgram.postGraduateProgram')),
            'role' => $this->pivot->role,
            'reviewerConfirmation' => $this->pivot->reviewer_confirmation,
        ];
    }
}
