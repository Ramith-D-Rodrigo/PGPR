<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\ShowFinalReportRequest;
use App\Http\Requests\V1\ShowPreliminaryReportRequest;
use App\Http\Requests\V1\ShowReviewTeamDeskEvaluationProgressRequest;
use App\Http\Requests\V1\ShowReviewTeamProperEvaluationProgressRequest;
use App\Http\Requests\V1\StoreAssignReviewTeamMemberCriteriaRequest;
use App\Http\Resources\V1\ReviewTeamResource;
use App\Models\ReviewTeam;
use App\Models\User;
use Exception;
use http\Env\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewTeamChairController extends Controller
{
    /**
     * Review team chair person can assign criteria to a review team member
     * in the proper evaluation
     *
     * {
     *       reviewTeamId: 10,
     *       reviewers: [
     *           {
     *               reviewerId: 10,
     *               criteria: [ 10, 17 ]
     *           },
     *           {
     *                reviewerId: 14,
     *                criteria: [ 14, 12 ]
     *            }
     *       ]
     *   }
     *
     */
    public function assignReviewTeamMembersCriteriaForProperEvaluation(StoreAssignReviewTeamMemberCriteriaRequest $request): \Illuminate\Http\JsonResponse
    {

        try {
            $validated = $request->validated();
            $reviewTeam = ReviewTeam::findOrFail($validated['review_team_id']);

            $postGraduateReviewProgram = $reviewTeam->postGraduateReviewProgram;

            if (!$postGraduateReviewProgram) {
                throw new Exception("This anomaly cannot happen");
            }

            DB::beginTransaction();

            foreach ($validated['reviewers'] as $reviewer) {
                foreach ($reviewer['criteria'] as $criteria) {
                    $values = [
                        'pgpr_id' => $postGraduateReviewProgram->id,
                        'assigned_by_chair_id' => Auth::id(),
                        'review_team_id' => $reviewTeam->id,
                        'assigned_to_reviewer_id' => $reviewer['reviewer_id'],
                        'criteria_id' => $criteria
                    ];
                    DB::table('review_team_set_criterias')->insertOrIgnore($values);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Criteria were successfully assigned.']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'The review team that you requested is not amongst our record, please check and retry'], 500);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Reviewer can view the desk evaluation progress of the review team members
     * GET request +>
     *              reviewTeam=10&deskEvaluation=12
     */
    public function viewReviewTeamDeskEvaluationProgress(ShowReviewTeamDeskEvaluationProgressRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            // Get all reviewer ids in your team
            $validated = $request->validated();

            $reviewer_ids = DB::table('reviewer_review_teams')
                ->where([
                    'review_team_id' => $validated['review_team_id'],
                    'role' => 'member', // assuming 'member' is the role of a normal team member
                ])
                ->pluck('reviewer_id');

            $data = [];

            foreach ($reviewer_ids as $reviewer_id) {
                // Get all criteria ids assigned to the reviewer
                $criteria_ids = DB::table('reivewer_team_set_criteria')
                    ->where([
                        'assigned_to_reviewer_id' => $reviewer_id,
                        'pgpr_id' => $validated['proper_evaluation_id'],
                    ])
                    ->pluck('criteria_id');

                foreach ($criteria_ids as $criteria_id) {
                    // Get the criteria name
                    $criteria_name = DB::table('criterias')->where('id', $criteria_id)->value('name');

                    // Count total number of standards for this criteria
                    $total_standards = DB::table('standards')->where('criteria_id', $criteria_id)->count();

                    // Count number of evaluated standards for this criteria
                    $evaluated_standards = DB::table('proper_evaluaiton_score')
                        ->join('standards', 'proper_evaluaiton_score.standard_id', '=', 'standards.id')
                        ->where([
                            'standards.criteria_id' => $criteria_id,
                            'proper_evaluaiton_score.proper_evaluation_id' => $validated['proper_evaluation_id'],
                            'proper_evaluaiton_score.reviewer_id' => $reviewer_id
                        ])
                        ->count();

                    // Store in array
                    $data[] = [
                        'reviewerId' => $reviewer_id,
                        'reviewerData' => User::find($reviewer_id),
                        'criteriaId' => $criteria_id,
                        'criteriaName' => $criteria_name,
                        'totalStandards' => $total_standards,
                        'evaluatedStandards' => $evaluated_standards,
                    ];
                }
            }
            return response()->json(['message' => 'Successful', 'data' => $data]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    public function viewReviewTeamProperEvaluationProgress(ShowReviewTeamProperEvaluationProgressRequest $request)
    {
    }

    public function viewPreliminaryReport(ShowPreliminaryReportRequest $request)
    {
        // TODO: COMPLETE THE FUNCTION
    }

    public function finishFinalReport(ShowFinalReportRequest $request)
    {
        // TODO: COMPLETE THE FUNCTION
    }
}
