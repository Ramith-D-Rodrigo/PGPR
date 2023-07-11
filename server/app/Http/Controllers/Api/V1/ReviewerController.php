<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Reviewer;
use App\Http\Requests\V1\StoreReviewerRequest;
use App\Http\Requests\V1\UpdateReviewerRequest;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\V1\ReviewerImport;
use Maatwebsite\Excel\Validators\ValidationException;

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

    //import reviewers using excel file
    public function importReviewers()
    {
        try{
            Excel::import(new ReviewerImport, request()->file('file'));
            return response()->json([
                'message' => 'Reviewers imported successfully'
            ], 200);
        }
        catch(ValidationException $e){
            $failures = $e -> errors();
            return response()->json([
                'errors' => $failures
            ], 422);
        }
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
