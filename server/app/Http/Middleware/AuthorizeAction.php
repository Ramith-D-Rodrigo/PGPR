<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthoriseAction
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(Request): (Response) $next
     * @param mixed ...$roles
     * @return Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // current authenticated user,
        $user = Auth::user();

        // current user role => the auth_role must be set in the array
        $auth_role = $request->session()->get('auth_role');

        // validate the current user role
        if ($user && $auth_role && in_array($auth_role, $roles)) {
            return $next($request);
        }

        // auth failed unauthorized
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
