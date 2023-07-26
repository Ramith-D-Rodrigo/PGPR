<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'official_email' => ['required', 'string', 'email'],
            'role' => [
                'required',
                Rule::in(['cqa_director', 'qac_officer', 'qac_director', 'reviewer', 'user', 'dean', 'vice_chancellor', 'programme_coordinator', 'iqau_director']), // TODO: add more roles
            ],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * convert the field names to processable fields
    */
    protected function prepareForValidation()
    {
        $this->merge([
            'official_email' => $this->officialEmail,
            'role' => $this->loginAs,
        ]);
    }


    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // get the user
        $user = User::where('official_email', $this->input('official_email'))->first();

        // check the existence of the user
        if (!$user) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'official_email' => __('auth.fail'),
            ]);
        }

        // check the user role of the user, (whether the requested role is there in the array)
        $req_role = $this->input('role');
        if(!in_array($req_role, json_decode($user->roles))) {
            // The requested role is not valid for this user.
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'role' => __('auth.invalid_role'),
            ]);
        }

        // perform user authentication
        if (!Auth::attempt($this->only('official_email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'official_email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'official_email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('official_email')) . '|' . $this->ip());
    }
}
