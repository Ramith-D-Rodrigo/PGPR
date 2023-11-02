<?php

namespace App\Http\Controllers\Api\V1;


use App\Http\Requests\V1\StoreProperEvaluationRequest;
use App\Http\Requests\V1\UpdateProperEvaluationRequest;
use App\Http\Resources\V1\ProperEvaluationCollection;
use App\Http\Resources\V1\ProperEvaluationResource;
use App\Mail\InformProperEvaluationActionToAuthorities;
use App\Models\ProperEvaluation;
use App\Http\Controllers\Controller;
use App\Models\ProperEvaluation1;
use App\Models\ProperEvaluation2;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ProperEvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ProperEvaluationCollection
    {
        //
        return new ProperEvaluationCollection(ProperEvaluation::all()->load(['properEvaluation1', 'properEvaluation2']));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProperEvaluationRequest $request): ProperEvaluationResource|\Illuminate\Http\JsonResponse
    {
        //
        try {
            $validated = $request->validated();

            $properEvaluation = new ProperEvaluation();
            $properEvaluation->pgpr_id = $validated['pgpr_id'];
            $properEvaluation->start_date = $validated['start_date'];
            $properEvaluation->end_date = $validated['end_date'];
            $properEvaluation->stage = '1';

            $properEvaluation1 = new ProperEvaluation1([
                'start_date' => $validated['start_date'],
                'pe_1_meeting_date' => NULL,
                'end_date' => NULL,
                'remark' => 'None'
            ]);

            $properEvaluation->properEvaluation1()->save($properEvaluation1);

            $properEvaluation->save();

            return new ProperEvaluationResource($properEvaluation);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): ProperEvaluationResource|\Illuminate\Http\JsonResponse
    {
        //
        //
        try {
            return new ProperEvaluationResource(ProperEvaluation::findOrFail($id));
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'The proper evaluation id you mentioned could not be found please try again after making amends'], 422);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProperEvaluationRequest $request,  string $id): ProperEvaluation|\Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $properEvaluation = ProperEvaluation::findOrFail($id);

            DB::beginTransaction();

            if (array_key_exists('status', $validated)) {
                if ($properEvaluation->stage == 'COMPLETED') {
                    return response()->json(['message' => 'The proper evaluation is not in an updatable state.'], 422);
                }

                // switching from PE1 to PE2
                if ($validated['status'] == '2' && $properEvaluation->stage == '1') {

                    $properEvaluation -> stage = '2';
                    $properEvaluation -> save();

                    $properEvaluation2 = new ProperEvaluation2([
                        'start_date' => Carbon::today(),
                        'end_date' => NULL,
                        'site_visit_start_date' => NULL,
                        'site_visit_end_date' => NULL,
                        'remark' => 'None',
                    ]);

                    $properEvaluation->properEvaluation2()->save($properEvaluation2);
                    $properEvaluation2 -> save();
                    $pgpr = $properEvaluation -> postGraduateProgramReview;
                    $pgpr -> status_of_pgpr = 'PE2';
                    $pgpr -> save();

                }
            } else if ($properEvaluation->stage == 'COMPLETED') {
                return response()->json(['message' => 'This proper evaluation is completed, no further updates are allowed'], 422);
            }

            $postGraduateProgramReview = $properEvaluation->postGraduateProgramReview;
            $postGraduateProgram = $postGraduateProgramReview->postGraduateProgram;
            $faculty = $postGraduateProgram->faculty;
            $university = $faculty->university;
            $iqauDirector = $faculty->internalQualityAssuranceUnit->internalQualityAssuranceUnitDirector->user;
            $dean = $faculty->currentDean->user;
            $programmeCoordinator = $postGraduateProgram->currentProgrammeCoordinator->user;
            $reviewers = $postGraduateProgramReview->acceptedReviewTeam->reviewers;
            $properEvaluation->update($validated);

            // TODO: INFORM REVIEWERS, DEAN, PROGRAMME CO., IQAU DIR
            // dean
            $properEvaluation->save();

            DB::commit();
            return response()->Json(['message' => 'successful', 'data' => new ProperEvaluationResource($properEvaluation)]);

        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'The proper evaluation id you mentioned could not be found please try again after making amends'], 422);
        } catch (Exception $exception) {
            DB::rollBack();
            //return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
            throw $exception;
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProperEvaluation $properEvaluation)
    {
        //
    }
}
