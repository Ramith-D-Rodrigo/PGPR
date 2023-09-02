<?php

namespace App\Http\Controllers\Api\V1;


use App\Http\Requests\V1\StoreDeskEvaluationRequest;
use App\Http\Requests\V1\UpdateDeskEvaluationRequest;
use App\Models\DeskEvaluation;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;

class DeskEvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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
