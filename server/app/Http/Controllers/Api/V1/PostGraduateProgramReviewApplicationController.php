<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\PostGraduateProgramReviewApplicationCollection;
use App\Models\PostGraduateProgramReviewApplication;
use App\Http\Requests\V1\StorePostGraduateProgramReviewApplicationRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramReviewApplicationRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramReviewApplicationResource;
class PostGraduateProgramReviewApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return new PostGraduateProgramReviewApplicationCollection(PostGraduateProgramReviewApplication::paginate());
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
    public function store(StorePostGraduateProgramReviewApplicationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication)
    {
        return new PostGraduateProgramReviewApplicationResource($postGraduateProgramReviewApplication);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramReviewApplicationRequest $request, PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication)
    {
        //
    }
}
