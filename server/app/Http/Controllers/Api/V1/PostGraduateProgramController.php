<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StorePostGraduateProgramRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramRequest;
use App\Http\Resources\V1\PostGraduateProgramResource;
use App\Models\PostGraduateProgram;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramCollection;
use Illuminate\Support\Facades\Auth;

class PostGraduateProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new PostGraduateProgramCollection(PostGraduateProgram::paginate());
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
    public function store(StorePostGraduateProgramRequest $request)
    {
        //add authorized cqa director id to the request
        $request['added_by_cqa_director_id'] = Auth::user() -> id;
        return new PostGraduateProgramResource(PostGraduateProgram::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgram $postGraduateProgram)
    {
        return new PostGraduateProgramResource($postGraduateProgram);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostGraduateProgram $postGraduateProgram)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramRequest $request, PostGraduateProgram $postGraduateProgram)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgram $postGraduateProgram)
    {
        //
    }
}
