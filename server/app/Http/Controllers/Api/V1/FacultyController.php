<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\FacultyCollection;
use App\Http\Resources\V1\FacultyResource;
use App\Models\Faculty;
use App\Http\Requests\V1\StoreFacultyRequest;
use App\Http\Requests\V1\UpdateFacultyRequest;
use App\Http\Controllers\Controller;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new FacultyCollection(Faculty::paginate());
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
    public function store(StoreFacultyRequest $request)
    {
        return new FacultyResource(Faculty::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Faculty $faculty)
    {
        return new FacultyResource($faculty);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faculty $faculty)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyRequest $request, Faculty $faculty)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faculty $faculty)
    {
        //
    }
}
