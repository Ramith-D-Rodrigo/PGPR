<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\RegisteredEmail;
use App\Http\Requests\V1\StoreRegisteredEmailRequest;
use App\Http\Requests\V1\UpdateRegisteredEmailRequest;
use App\Http\Controllers\Controller;

class RegisteredEmailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegisteredEmailRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RegisteredEmail $registeredEmail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RegisteredEmail $registeredEmail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegisteredEmailRequest $request, RegisteredEmail $registeredEmail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RegisteredEmail $registeredEmail)
    {
        //
    }
}
