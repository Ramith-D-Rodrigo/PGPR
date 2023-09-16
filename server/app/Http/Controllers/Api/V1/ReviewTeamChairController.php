<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\ShowDEScoresOfReviewTeamRequest;
use App\Http\Requests\V1\ShowFinalReportRequest;
use App\Http\Requests\V1\ShowPEScoresOfReviewTeamRequest;
use App\Http\Requests\V1\ShowPreliminaryReportRequest;
use App\Http\Requests\V1\ShowReviewTeamDeskEvaluationProgressRequest;
use App\Http\Requests\V1\ShowReviewTeamProperEvaluationProgressRequest;
use App\Http\Requests\V1\StoreAssignReviewTeamMemberCriteriaRequest;
use App\Http\Requests\V1\StoreConductDeskEvaluationRequest;
use App\Http\Requests\V1\StoreConductProperEvaluationRequest;
use App\Http\Requests\V1\UpdateReviewChairSubmitDERequest;
use App\Http\Requests\V1\UpdateReviewChairSubmitPERequest;
use App\Http\Resources\V1\ReviewTeamResource;
use App\Mail\InformEvaluationSubmissionToOfficials;
use App\Models\DeskEvaluation;
use App\Models\PostGraduateProgramReview;
use App\Models\ProperEvaluation;
use App\Models\ProperEvaluation1;
use App\Models\ReviewTeam;
use App\Models\User;
use App\Services\V1\ScoreCalculationService;
use App\Services\V1\StandardService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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
            $validated = $request->validated();

            // Get all reviewer ids in your team
            $reviewer_ids = DB::table('reviewer_review_teams')
                ->where([
                    'review_team_id' => $validated['review_team_id'],
                    'role' => 'MEMBER',
                ])
                ->pluck('reviewer_id');

            $reviewTeam = ReviewTeam::find($validated['review_team_id']);
            $pgp = $reviewTeam->postGraduateProgramReview->postGraduateProgram;
            $data = [];

            foreach ($reviewer_ids as $reviewer_id) {
                // Get all criteria ids
                $criteria_ids = DB::table('criterias')->pluck('id');

                $criteria_data = [];

                foreach ($criteria_ids as $criteria_id) {
                    // Get criteria name
                    $criteria_name = DB::table('criterias')->where('id', $criteria_id)->value('name');

                    // Count the total number of standards for this criteria
                    $total_standards = count(StandardService::getApplicableStandards(
                        $pgp->slqf_level,
                        $pgp->is_professional_pg_programme,
                        $criteria_id
                    ));

                    // Count the number of evaluated standards for this criteria
                    $evaluated_standards = DB::table('desk_evaluation_scores')
                        ->join('standards', 'desk_evaluation_scores.standard_id', '=', 'standards.id')
                        ->where([
                            'standards.criteria_id' => $criteria_id,
                            'desk_evaluation_scores.desk_evaluation_id' => $validated['desk_evaluation_id'],
                            'desk_evaluation_scores.reviewer_id' => $reviewer_id
                        ])
                        ->count();

                    $criteria_data[] = [
                        'criteriaId' => $criteria_id,
                        'criteriaName' => $criteria_name,
                        'totalStandards' => $total_standards,
                        'evaluatedStandards' => $evaluated_standards,
                    ];
                }

                $data[] = [
                    'reviewerId' => $reviewer_id,
                    'reviewerData' => User::find($reviewer_id),
                    'criteriaData' => $criteria_data,
                ];
            }

            return response()->json(['message' => 'Successful', 'data' => $data]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }


    /**
     * Reviewer can view the proper evaluation progress of the review team members
     * GET request +>
     *              pgpr=8&reviewTeam=10&properEvaluation=12
     */
    public function viewReviewTeamProperEvaluationProgress(ShowReviewTeamProperEvaluationProgressRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $reviewer_ids = DB::table('reviewer_review_teams')
                ->where([
                    'review_team_id' => $validated['review_team_id'],
                ])
                ->whereIn('role', ['MEMBER', 'CHAIR'])
                ->pluck('reviewer_id');

            $reviewTeam = ReviewTeam::find($validated['review_team_id']);
            $pgp = $reviewTeam->postGraduateProgramReview->postGraduateProgram;
            $data = [];

            foreach ($reviewer_ids as $reviewer_id) {
                $criteria_ids = DB::table('reviewer_team_set_criteria')
                    ->where([
                        'assigned_to_reviewer_id' => $reviewer_id,
                        'pgpr_id' => $validated['pgpr_id'],
                    ])
                    ->pluck('criteria_id');

                $criteria_data = [];

                foreach ($criteria_ids as $criteria_id) {
                    // Get criteria name
                    $criteria_name = DB::table('criterias')->where('id', $criteria_id)->value('name');

                    // Count total number of standards for this criteria
                    $total_standards = count(StandardService::getApplicableStandards(
                        $pgp->slqf_level,
                        $pgp->is_professional_pg_programme,
                        $criteria_id
                    ));

                    // Count number of evaluated standards for this criteria
                    $evaluated_standards = DB::table('proper_evaluation_score')
                        ->join('standards', 'proper_evaluation_score.standard_id', '=', 'standards.id')
                        ->where([
                            'standards.criteria_id' => $criteria_id,
                            'proper_evaluation_score.proper_evaluation_id' => $validated['proper_evaluation_id'],
                            'proper_evaluation_score.reviewer_id' => $reviewer_id
                        ])
                        ->count();

                    $criteria_data[] = [
                        'criteriaId' => $criteria_id,
                        'criteriaName' => $criteria_name,
                        'totalStandards' => $total_standards,
                        'evaluatedStandards' => $evaluated_standards,
                    ];
                }

                $data[] = [
                    'reviewerId' => $reviewer_id,
                    'reviewerData' => User::find($reviewer_id),
                    'criteriaData' => $criteria_data,
                ];
            }
            return response()->json(['message' => 'Successful', 'data' => $data]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     *
     * GET request +>
     *              /{pgpr}/{deskEvaluation}
     *
     * check whether all the reviewers have entered the same scores for each
     * standard
     *
     */
    public function submitDeskEvaluation(UpdateReviewChairSubmitDERequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            if (self::canSubmitDeskEvaluation($validated['pgpr_id'])) {
                // the desk evaluation can be submitted
                $grading = ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated['pgpr_id'], stage: 'DE');
                // since the desk evaluation is completed, automatically create the proper evaluation

                DB::beginTransaction();
                $deskEvaluation = DeskEvaluation::find($validated['desk_evaluation_id']);

                $properEvaluation = new ProperEvaluation();
                $properEvaluation->pgpr_id = $validated['pgpr_id'];
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
                $deskEvaluation->status = 'COMPLETED';
                $deskEvaluation->save();

                // send the mails as well
                // to the dean, program coordinator, qac officer
                $pgpr = $deskEvaluation->postGraduateProgramReview;
                $qacDir = User::find($pgpr->qac_dir_id);
                $pgp = $pgpr->postGraduateProgram;
                $programCoordinator = User::find($pgp->programme_coordinator_id);
                $faculty = $pgp->faculty;
                $university = $faculty->university;
                $dean = User::find($faculty->dean->id);

                // qac dir
                Mail::to(
                    $qacDir->official_email
                )->send(
                    new InformEvaluationSubmissionToOfficials(
                        recipient: $qacDir,
                        subject: "The desk evaluation of the {$pgp->title} was conculded.",
                        content: 'mail.informDeskEvalautionToOfficials',
                        pgp: $pgp,
                        faculty: $faculty,
                        university: $university,
                        data: $grading,
                    )
                );

                // dean
                Mail::to(
                    $dean->official_email
                )->send(
                    new InformEvaluationSubmissionToOfficials(
                        recipient: $dean,
                        subject: "The desk evaluation of the {$pgp->title} was conculded.",
                        content: 'mail.informDeskEvalautionToOfficials',
                        pgp: $pgp,
                        faculty: $faculty,
                        university: $university,
                        data: $grading,
                    )
                );

                // program coordinator
                Mail::to(
                    $programCoordinator->official_email
                )->send(
                    new InformEvaluationSubmissionToOfficials(
                        recipient: $programCoordinator,
                        subject: "The desk evaluation of the {$pgp->title} was conculded.",
                        content: 'mail.informDeskEvalautionToOfficials',
                        pgp: $pgp,
                        faculty: $faculty,
                        university: $university,
                        data: $grading,
                    )
                );
                DB::commit();
                return response()->json(['message' => 'The desk evaluation was successfully submitted', 'data' => $grading]);
            }
            // the desk evaluation cannot be submitted
            return response()->json([
                'message' => 'The desk evaluation cannot be submitted yet, there are some inconsistencies with the scores provided by the review team, please check the progress.',
                'data' => []
            ]);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    private function canSubmitDeskEvaluation($pgprId): bool
    {
        $reviewTeam = DB::table('review_teams')->where('pgpr_id', $pgprId)->first();
        $pgp = PostGraduateProgramReview::find($pgprId)->postGraduateProgram;

        if (!$reviewTeam) {
            return false;
        }

        $reviewers = DB::table('reviewer_review_teams')->where('review_team_id', $reviewTeam->id)->pluck('reviewer_id');

        $criteria = DB::table('criterias')->get();

        foreach ($criteria as $criterion) {
            // Get all standards for this criteria
            $standards = StandardService::getApplicableStandards(
                $pgp->slqf_level,
                $pgp->is_professional_pg_programme,
                $criterion->id
            );

            foreach ($standards as $standard) {
                // Get all scores for this standard
                $scores = DB::table('desk_evaluation_score')
                    ->whereIn('reviewer_id', $reviewers)
                    ->where('standard_id', $standard->id)
                    ->pluck('de_score');

                if ($scores->isEmpty() || $scores->unique()->count() > 1) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     *
     * GET request +>
     *              /{pgpr}/{properEvaluation}
     *
     */
    public function submitProperEvaluation(UpdateReviewChairSubmitPERequest $request)
    {
        // TODO: COMPLETE THE FUNCTION
        try {
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     *
     * review chair can view summary of proper evaluation grades of each member of the team(including himself)
     * /{pgpr}/{criteria}/{standard}
     *
     */
    public function viewDEScoresOfEachStandardOfEachTeamMember(ShowDEScoresOfReviewTeamRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateProgramReview = PostGraduateProgramReview::find($validated['pgpr_id']);
            $deskEvaluation = $postGraduateProgramReview->deskEvaluation();

            if ($deskEvaluation) {
                $data = DB::table('desk_evaluation_score')
                    ->select('reviewer_id', 'de_score', 'comment')
                    ->where('desk_evaluation_id', $deskEvaluation->id)
                    ->where('standard_id', $validated['standard_id'])
                    ->get();
                return response()->json(['message' => 'Successful', 'data' => $data]);
            } else {
                return response()->json(
                    ['message' => 'Desk evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }


    /**
     *
     * review chair can view summary of desk evaluation grades of each member of the team(including himself)
     * /{pgpr}/{criteria}/{standard}
     *
     */
    public function viewPEScoresOfEachStandardOfEachTeamMember(ShowPEScoresOfReviewTeamRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateProgramReview = PostGraduateProgramReview::find($validated['pgpr_id']);
            $properEvaluation = $postGraduateProgramReview->properEvaluation();

            if ($properEvaluation) {
                $data = DB::table('proper_evaluation_score')
                    ->select('reviewer_id', 'pe_score', 'comment')
                    ->where('proper_evaluation_id', $properEvaluation->id)
                    ->where('standard_id', $validated['standard_id'])
                    ->get();
                return response()->json(['message' => 'Successful', 'data' => $data]);
            } else {
                return response()->json(
                    ['message' => 'Proper evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * POST request +>
     *       {
     *           pgprId: 10,
     *           criteriaId: 10,
     *           standardId: 10,
     *           observations: "This is marvelous",
     *           score: 0 <= x <= 3
     *       }
     */
    public function updateDEScoresOfEachStandard(StoreConductDeskEvaluationRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($validated['pgpr_id']);
            $properEvaluation = $postGraduateReviewProgram->properEvaluation;

            if ($properEvaluation) {
                DB::table('proper_evaluation_score')
                    ->where('proper_evaluation_id', $properEvaluation->id)
                    ->where('standard_id', $validated['standard_id'])
                    ->update(['pe_score' => $validated['pe_score']]);

                return response()->json(['message' => 'Successful, added the data']);
            } else {
                return response()->json(
                    ['message' => 'Proper evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        } catch (ModelNotFoundException $exception) {
            return response()->json(
                ['message' => 'We could find the requested post graduate review program, please check and retry'],
                500
            );
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * POST request +>
     *       {
     *           pgprId: 10,
     *           criteriaId: 10,
     *           standardId: 10,
     *           observations: "This is marvelous",
     *           score: 0 <= x <= 3
     *       }
     */
    public function updatePEScoresOfEachStandard(StoreConductProperEvaluationRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($validated['pgpr_id']);
            $deskEvaluation = $postGraduateReviewProgram->deskEvaluation;

            if ($deskEvaluation) {
                DB::table('desk_evaluation_score')
                    ->where('desk_evaluation_id', $deskEvaluation->id)
                    ->where('standard_id', $validated['standard_id'])
                    ->update(['de_score' => $validated['de_score']]);

                return response()->json(['message' => 'Successful, added the data']);
            } else {
                return response()->json(
                    ['message' => 'Desk evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        } catch (ModelNotFoundException $exception) {
            return response()->json(
                ['message' => 'We could find the requested post graduate review program, please check and retry'],
                500
            );
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
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
