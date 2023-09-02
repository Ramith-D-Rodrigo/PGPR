<?php

namespace App\Http\Controllers\Api\V1;


use App\Http\Requests\V1\StoreDeskEvaluationRequest;
use App\Http\Requests\V1\UpdateDeskEvaluationRequest;
use App\Http\Resources\V1\DeskEvaluationCollection;
use App\Http\Resources\V1\DeskEvaluationResource;
use App\Models\DeskEvaluation;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DeskEvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        return new DeskEvaluationCollection(DeskEvaluation::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeskEvaluationRequest $request): DeskEvaluationResource|\Illuminate\Http\JsonResponse
    {
        //
        // create the record
        try {
            $validated = $request->validated();

            $deskEvaluation = new DeskEvaluation();
            $deskEvaluation->pgpr_id = $validated['pgpr_id'];
            $deskEvaluation->start_date = $validated['start_date'];
            $deskEvaluation->end_date = $validated['end_date'];
            $deskEvaluation->status = 'ONGOING';
            $deskEvaluation->save();

            return new DeskEvaluationResource($deskEvaluation);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): DeskEvaluationResource|\Illuminate\Http\JsonResponse
    {
        //
        try {
            return new DeskEvaluationResource(DeskEvaluation::findOrFail($id));
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'The desk evaluation id you mentioned could not be found please try again after making amends'], 422);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeskEvaluationRequest $request, string $id): DeskEvaluationResource|\Illuminate\Http\JsonResponse
    {
        //
        try {
            $validated = $request->validated();
            $deskEvaluation = DeskEvaluation::findOrFail($id);

            $deskEvaluation->update(
                $validated
            );

            $deskEvaluation->save();

            return new DeskEvaluationResource($deskEvaluation);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'The desk evaluation id you mentioned could not be found please try again after making amends'], 422);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeskEvaluation $deskEvaluation)
    {
        //
    }
}
