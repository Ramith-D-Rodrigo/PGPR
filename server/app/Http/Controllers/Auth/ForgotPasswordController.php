<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function emailVerification(Request $request): JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $officialEmail =  $request->has('officialEmail') ? $request->get('officialEmail') : '';

        $validator = Validator::make(['official_email' => $officialEmail], [
            'official_email' => 'required|email|exists:users,official_email',
        ], [
            'official_email.required' => "You have to provide us an your official email in order to confirm it's actually you.",
            'official_email.exists' => "Sorry the official email you provided doesn't exists among our records, please check and retry",
        ]);

        $validated = $validator->validated();
        if ($validator->passes()) {
            /*
             * WHO HARD CODED THE FRIGGING EMAIL AS 'email' -> LARAVEL DEV TEAM
             * $status = Password::sendResetLink(
                ['email' => $officialEmail],
                function ($official_email, $token) {
                    return env('FRONTEND_URL') . '/reset-password?token=' . $token;
                }
            );*/

            $user = User::where('official_email', $officialEmail)->first();

            $token = Password::createToken($user);
            // add the token to the database
            $flag = DB::table('password_reset_tokens')->updateOrInsert([
                'email' => $officialEmail
            ], [
                'token' => $token,
                'created_at' => now()
            ]);

            $flag1 = Mail::to($officialEmail)->send(
                new ForgotPasswordMail(
                    user: $user,
                    url: env('FRONTEND_URL') . '/reset-password?token=' . $token,
                    subject: 'Email verification for resetting the password',
                    content: 'mail.forgotPasswordMailTemplate'
                )
            );

            if ($flag && $flag1) {
                return response()->json([
                    'message' => 'The reset link has been sent to your official email, please check your email to proceed.'
                ]);
            } else {
                return response()->json(['message' => 'You password reset link cannot be sent, please check again later.']);
            }
        } else {
            var_dump($validated);
            return response()->json(['message' => 'Unsuccessful', 'errors' => $validator->errors()]);
        }
    }

    /**
     * @throws ValidationException
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make(
            [
                'official_email' => $request->has('officialEmail') ? $request->get('officialEmail') : '',
                'token' => $request->has('token') ? $request->get('token') : '',
                'password' => $request->has('password') ? $request->get('password') : '',
                'password_confirmation' => $request->has('confirmedPassword') ? $request->get('confirmedPassword') : '',
            ],
            [
                'official_email' => 'required|email|exists:users,official_email',
                'password' => 'required|min:8|max:50|confirmed',
                'password_confirmation' => 'required|min:8|max:50',
                'token' => 'required',
            ],
            [
                'token.required' => "The token is required.",
                'password.required' => "The password is required.",
                'password.min' => "The password must be at least 8 characters long.",
                'password.max' => "The password can not have more than 50 characters.",
                'password_confirmation.required' => "The confirm password is required.",
                'password_confirmation.min' => "The confirm password must be at least 8 characters long.",
                'password_confirmation.max' => "The confirm password can not have more than 50 characters.",
                'officialEmail.required' => "You have to provide us an your official email in order to confirm it's actually you.",
                'officialEmail.exists' => "Sorry the official email you provided doesn't exists among our records, please check and retry",
            ]
        );

        if ($validator->passes()) {
            $validated = $validator->validated();

            $user = User::where('official_email', $validated['official_email'])->first();
            $user->password = Hash::make($validated['password']);

            $flag = DB::table('password_reset_tokens')->where('email', $validated['official_email'])->delete();

            $saved = $user->save();

            if ($flag && $saved) {
                return response()->json(['message' => 'The password was successfully changed.']);
            } else {
                return response()->json(['message' => 'Sorry your password cannot be changed, please try again later.']);
            }
        } else {
            return response()->json(['message' => 'Unsuccessful', 'errors' => $validator->errors()]);
        }
    }
}
