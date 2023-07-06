<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\University;
use App\Http\Requests\V1\StoreUniversityRequest;
use App\Http\Requests\V1\UpdateUniversityRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UniversityResource;
use App\Http\Resources\V1\UniversityCollection;

class UniversityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new UniversityCollection(University::paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUniversityRequest $request)
    {
        return new UniversityResource(University::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(University $university)
    {
        return new UniversityResource($university);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniversityRequest $request, University $university)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(University $university)
    {
        //
    }
}
