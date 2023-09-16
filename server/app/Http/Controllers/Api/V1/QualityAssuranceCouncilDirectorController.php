<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StoreQualityAssuranceCouncilDirectorRequest;
use App\Http\Requests\V1\UpdateQualityAssuranceCouncilDirectorRequest;
use App\Models\PostGraduateProgramReview;
use App\Models\QualityAssuranceCouncilDirector;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class QualityAssuranceCouncilDirectorController extends Controller
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
    public function store(StoreQualityAssuranceCouncilDirectorRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(QualityAssuranceCouncilDirector $qualityAssuranceCouncilDirector)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QualityAssuranceCouncilDirector $qualityAssuranceCouncilDirector)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQualityAssuranceCouncilDirectorRequest $request, QualityAssuranceCouncilDirector $qualityAssuranceCouncilDirector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QualityAssuranceCouncilDirector $qualityAssuranceCouncilDirector)
    {
        //
    }

    /**
     * Mark the review process as completed
     *
     * POST request +>
     *               {
     *                   'pgpr': 10
     *               }
     *
     *
     * @throws ValidationException
     */
    public function markReviewProcessAsCompleted(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pgpr' => [
                'required',
                'exists:post_graduate_program_reviews,id',
                function ($attribute, $value, $fail) {
                    $pgpr = PostGraduateProgramReview::find($value);
                    if ($pgpr->status_of_pgpr != 'FINAL') {
                        $fail('The post graduate review program is not in an updatable state.');
                    }
                },
                function ($attribute, $value, $fail) {
                    $pgpr = PostGraduateProgramReview::find($value);
                    $reviewTeam = $pgpr->reviewTeam;

                    $data = DB::table('final_reports')
                        ->select('type')
                        ->where('pgpr_id', $pgpr->id)
                        ->where('reviewer_team_id', $reviewTeam->id)
                        ->first();
                    if ($data->type != 'SUBMITTED') {
                        $fail('The final report has not been submitted yet cannot change the state yet.');
                    }
                },
            ],
        ], [
            'pgpr.required' => 'The post graduate program review id is required.',
            'pgpr.exists' => 'The post graduate program review does not exist in our database.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        try {
            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $pgpr->status_of_pgpr = 'COMPLETED';
            return response()->json(['message' => 'The review was successful marked as completed']);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }
}
