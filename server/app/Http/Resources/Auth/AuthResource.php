<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * This is used for getting the necessary fields of the authenticated user
*/

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'officialEmail' => $this->official_email,
            'fullName' => $this->full_name,
            'authRole' => [$request->session()->get('authRole')],
            'session' => true,
            'initialLogin' => !($this->logins),
        ];
    }

    public function withResponse(Request $request, JsonResponse $response): void
    {

    }
}
