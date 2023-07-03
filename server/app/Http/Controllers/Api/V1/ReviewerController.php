<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Reviewer;
use App\Http\Requests\StoreReviewerRequest;
use App\Http\Requests\UpdateReviewerRequest;
use App\Http\Controllers\Controller;

class ReviewerController extends Controller
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
    public function store(StoreReviewerRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Reviewer $reviewer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reviewer $reviewer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewerRequest $request, Reviewer $reviewer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reviewer $reviewer)
    {
        //
    }
}
