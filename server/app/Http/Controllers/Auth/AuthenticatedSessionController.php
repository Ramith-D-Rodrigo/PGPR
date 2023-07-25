<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\api\v1\UserController;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     * @throws ValidationException
     */
    public function store(LoginRequest $request): Response|string
    {
        $request->authenticate();

        $request->session()->regenerate();

        session()->put('authRole', !$request->input('role') ? 'user': $request->input('role')); // add the default user role => user

        return response((new UserController())->loginAuth());
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        session()->remove('authRole'); // remove the user role from the session as well

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
