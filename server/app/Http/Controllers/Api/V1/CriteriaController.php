<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StoreCriteriaRequest;
use App\Http\Requests\V1\UpdateCriteriaRequest;
use App\Models\Criteria;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CriteriaCollection;
use App\Http\Resources\V1\CriteriaResource;

class CriteriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new CriteriaCollection(Criteria::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCriteriaRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Criteria $criteria)
    {
        return new CriteriaResource($criteria);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCriteriaRequest $request, Criteria $criteria)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Criteria $criteria)
    {
        //
    }
}
