<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreDeskEvaluationRequest;
use App\Http\Requests\UpdateDeskEvaluationRequest;
use App\Models\DeskEvaluation;
use App\Http\Controllers\Controller;

class DeskEvaluationController extends Controller
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
    public function store(StoreDeskEvaluationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DeskEvaluation $deskEvaluation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DeskEvaluation $deskEvaluation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeskEvaluationRequest $request, DeskEvaluation $deskEvaluation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeskEvaluation $deskEvaluation)
    {
        //
    }
}
