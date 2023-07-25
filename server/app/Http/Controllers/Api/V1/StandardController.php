<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\StandardCollection;
use App\Models\Standard;
use App\Http\Requests\StoreStandardRequest;
use App\Http\Requests\UpdateStandardRequest;
use App\Http\Controllers\Controller;

class StandardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new StandardCollection(Standard::paginate());
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
    public function store(StoreStandardRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Standard $standard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Standard $standard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStandardRequest $request, Standard $standard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Standard $standard)
    {
        //
    }
}
