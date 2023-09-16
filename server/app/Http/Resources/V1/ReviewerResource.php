<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'userData' => new UserResource($this->whenLoaded('user')),
            'reviewerStatus' => $this->reviewer_status,
            'faculty' => new FacultyResource($this->whenLoaded('workingFaculty')),
            'reviews' => new ReviewTeamCollection($this->whenLoaded('reviewTeams')),
        ];
    }
}
