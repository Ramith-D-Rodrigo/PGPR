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
            'id' => $this -> id,
            'officialEmail' => $this->official_email,
            'fullName' => $this->full_name,
            'authRole' => [$request->session()->get('authRole')],
            'session' => true,
            'profilePic' => $this->profile_pic,
            'initials' => $this->initials,
            'surname' => $this->surname,
            'initialLogin' => $this->logins == 0,
        ];
    }
}
