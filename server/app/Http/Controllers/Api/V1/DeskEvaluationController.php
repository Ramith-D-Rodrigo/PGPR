<?php

namespace App\Http\Controllers\Api\V1;


use App\Http\Requests\V1\ShowDeskEvaluationRemarksRequest;
use App\Http\Requests\V1\ShowStandardWiseDetailsOfEachCriteriaRequest;
use App\Http\Requests\V1\StoreDeskEvaluationRequest;
use App\Http\Requests\V1\UpdateDeskEvaluationRequest;
use App\Http\Resources\V1\DeskEvaluationCollection;
use App\Http\Resources\V1\DeskEvaluationResource;
use App\Models\DeskEvaluation;
use App\Http\Controllers\Controller;
use App\Models\ProperEvaluation;
use App\Models\ProperEvaluation1;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeskEvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): DeskEvaluationCollection
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

            if (array_key_exists('status', $validated)) {
                if ($deskEvaluation->status == 'COMPLETED') {
                    return response()->json(['message' => 'The desk evaluation is not in an updatable state'], 422);
                } else {
                    // since the desk evaluation is completed, automatically create the proper evaluation
                    $properEvaluation = new ProperEvaluation();
                    $properEvaluation->pgpr_id = $deskEvaluation->pgpr_id;
                    $properEvaluation->start_date = Carbon::today();
                    $properEvaluation->end_date = NULL;
                    $properEvaluation->status = '1';

                    $properEvaluation1 = new ProperEvaluation1([
                        'start_date' => Carbon::today(),
                        'pe_1_meeting_date' => NULL,
                        'end_date' => NULL,
                        'remark' => 'None'
                    ]);

                    $properEvaluation->properEvaluation1()->save($properEvaluation1);

                    $properEvaluation->save();
                }
            }

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
     * Reviewer view standard wise details
     *
     * GET request +>
     *              deskEvaluation=10&criteria=12
     *
     */
    public function viewStandardWiseDetailsOfEachCriteriaInDE(ShowStandardWiseDetailsOfEachCriteriaRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $data = DB::table('desk_evaluation_score')
                ->join(
                    'standards',
                    'desk_evaluation_score.standard_id',
                    '=', 'standards.id')
                ->select(
                    [
                        'desk_evaluation_score.desk_evaluation_id as deskEvaluationId',
                        'desk_evaluation_score.standard_id as standardId',
                        'standard.standard_no as standardNo',
                        'desk_evaluation_score.comment as comment',
                        'desk_evaluation_score.de_score as score'
                    ]
                )
                ->where([
                    'standards.criteria_id' => $validated['criteria_id'],
                    'desk_evaluation_score.desk_evaluation_id' => $validated['desk_evaluation_id'],
                    'desk_evaluation_score.reviewer_id' => Auth::id()
                ])
                ->get();
            return $data != null ?
                response()->json(['message' => 'Success', 'data' => $data]) :
                response()->json(['message' => 'No data under this criteria yet.', 'data' => $data]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }


    /**
     * Get desk evaluation remark and score for a standard
     *
     * GET request +>
     *          ?deskEvaluation=10&criteria=12&standard=8
     */
    public function getDeskEvaluationRemarkAndScoreForStandard(ShowDeskEvaluationRemarksRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $data = DB::table('desk_evaluation_score')->select([
                'desk_evaluation_id as deskEvaluationId',
                'standard_id as standardId',
                'comment',
                'de_score as score'
            ])->where([
                'reviewer_id' => Auth::id(),
                'desk_evaluation_id' => $validated['desk_evaluation_id'],
                'standard_id' => $validated['standard_id'],
            ])->first();
            return $data != null ?
                response()->json(['message' => 'Successful', 'data' => $data]) :
                response()->json(['message' => 'There were no records for this standard', 'data' => []]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Reviewer Use case 1.6
     * View summary of DE grade
     */
    public function viewSummaryOfDEGrade()
    {
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeskEvaluation $deskEvaluation)
    {
        //
    }
}
