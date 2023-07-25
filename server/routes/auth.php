<?php

use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// this is not used since, choosing user roles after login will not be implemented
//use App\Http\Controllers\Auth\AuthorizeController;

use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ResetPasswordController;


Route::post('/login', [AuthenticatedSessionController::class, 'store'])
//                ->middleware('initial.login')
                ->name('login');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::post('/initial-password-reset', [ResetPasswordController::class, 'store'])
    ->middleware('auth')
    ->name('initial.password.reset');

/*Route::post('/register', [RegisteredUserController::class, 'store'])
                // ->middleware('guest')
                ->name('register');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                // ->middleware('guest')
                ->name('password.email');

Route::post('/initial-password-reset', [ResetPasswordController::class, 'store'])
    // ->middleware('guest')
    ->name('initial.password.reset');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
                // ->middleware('guest')
                ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['auth', 'signed', 'throttle:6,1'])
                ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware(['auth', 'throttle:6,1'])
                ->name('verification.send');*/
