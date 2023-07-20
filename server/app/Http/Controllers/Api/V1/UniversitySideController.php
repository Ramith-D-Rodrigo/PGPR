<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\UniversitySide;
use App\Http\Requests\StoreUniversitySideRequest;
use App\Http\Requests\UpdateUniversitySideRequest;
use App\Http\Controllers\Controller;

class UniversitySideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return UniversitySide::all();
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
    public function store(StoreUniversitySideRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UniversitySide $universitySide)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UniversitySide $universitySide)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniversitySideRequest $request, UniversitySide $universitySide)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UniversitySide $universitySide)
    {
        //
    }
}
