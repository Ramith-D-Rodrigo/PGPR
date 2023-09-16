<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    // create the initial login password change case in here
    /**
     * @throws ValidationException
     */
    public function store(PasswordResetRequest $request): JsonResponse
    {
        // echo json_encode($request->only('official_email')['official_email']);
        // echo json_encode($request->only('password')['password']);
        // exit;

//        $user = User ($request->only('official_email')['official_email'])->getFirst();
        // echo json_encode(Auth::user()->password);
        // exit;

        // changing the user password
        Auth::user()->password = Hash::make($request->only('password')['password']);
        if (Auth::user()->password) {
            Auth::user()->logins = Auth::user()->logins + 1;
            Auth::user()->status = 'active'; // change the status to active
            Auth::user()->save();
            return response()->json(["message" => "Password Successfully Changed"], 201);
        }
        return response()->json(["error" => "Password cannot be changed"], 422);
    }

}
