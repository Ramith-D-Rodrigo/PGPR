<?php

namespace App\Http\Controllers;

use App\Models\SelfEvaluationReport;
use App\Http\Requests\StoreSelfEvaluationReportRequest;
use App\Http\Requests\UpdateSelfEvaluationReportRequest;

class SelfEvaluationReportController extends Controller
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
    public function store(StoreSelfEvaluationReportRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSelfEvaluationReportRequest $request, SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }
}