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
            'pgprId' => $this->pgpr->id,
            'statusOfPGPR' => $this->pgpr->status_of_pgpr,
            'postGraduateProgram' => $this->post_graduate_program->title,
            'facultyName' => $this->faculty->name,
            'university' => $this->university->name,
            'role' => $this->review_team_pivot->role,
            'reviewerConfirmation' => $this->review_team_pivot->reviewer_confirmation,
        ];
    }
}
