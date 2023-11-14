<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\SetDatesForPE1Request;
use App\Http\Requests\V1\SetDatesForPE2Request;
use App\Http\Requests\V1\ShowDEScoresOfReviewTeamRequest;
use App\Http\Requests\V1\ShowDEScoresOfTeamMemberRequest;
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
use App\Http\Requests\V1\UploadFinalReportRequest;
use App\Http\Requests\V1\UploadPreliminaryReportRequest;
use App\Http\Resources\V1\ReviewTeamResource;
use App\Mail\InformEvaluationSubmissionToOfficials;
use App\Mail\InformReportUploadsToOfficials;
use App\Models\Criteria;
use App\Models\DeskEvaluation;
use App\Models\PostGraduateProgramReview;
use App\Models\ProperEvaluation;
use App\Models\ProperEvaluation1;
use App\Models\Reviewer;
use App\Models\ReviewTeam;
use App\Models\User;
use App\Services\V1\ScoreCalculationService;
use App\Services\V1\StandardService;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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
            Gate::authorize('assignReviewTeamMembersCriteriaForProperEvaluationAuthorize', [$request]);

            $validated = $request->validated();
            $reviewTeam = ReviewTeam::findOrFail($validated['review_team_id']);

            $postGraduateReviewProgram = $reviewTeam->postGraduateReviewProgram;

            if (!$postGraduateReviewProgram) {
                throw new Exception("This anomaly cannot happen");
            }

            DB::beginTransaction();

            foreach ($validated['reviewers'] as $reviewer) {
                //first remove all the previous assignments
                DB::table('review_team_set_criterias')
                    ->where('pgpr_id', $postGraduateReviewProgram->id)
                    ->where('assigned_to_reviewer_id', $reviewer['reviewer_id'])
                    ->delete();
                foreach ($reviewer['criteria'] as $criteria) {
                    $values = [
                        'pgpr_id' => $postGraduateReviewProgram->id,
                        'assigned_by_chair_id' => Auth::id(),
                        'review_team_id' => $reviewTeam->id,
                        'assigned_to_reviewer_id' => $reviewer['reviewer_id'],
                        'criteria_id' => $criteria,
                        'created_at' => Carbon::now(),
                    ];
                    DB::table('review_team_set_criterias')->insertOrIgnore($values);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Criteria were successfully assigned.']);
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e->getMessage()], 403);

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
                    'review_team_id' => $validated['review_team_id']
                ])
                ->pluck('reviewer_id');

            $reviewTeam = ReviewTeam::find($validated['review_team_id']);
            $pgp = $reviewTeam->postGraduateReviewProgram->postGraduateProgram;
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
                    $evaluated_standards = DB::table('desk_evaluation_score')
                        ->join('standards', 'desk_evaluation_score.standard_id', '=', 'standards.id')
                        ->where([
                            'standards.criteria_id' => $criteria_id,
                            'desk_evaluation_score.desk_evaluation_id' => $validated['desk_evaluation_id'],
                            'desk_evaluation_score.reviewer_id' => $reviewer_id
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
            $pgp = $reviewTeam->postGraduateReviewProgram->postGraduateProgram;
            $data = [];

            foreach ($reviewer_ids as $reviewer_id) {
                $criteria_ids = DB::table('review_team_set_criterias')
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
     * POST request +>
     *              {
     *                  pgpr: 10
     *              }
     *
     * check whether all the reviewers have entered the same scores for each
     * standard
     *
     */
    public function submitDeskEvaluation(UpdateReviewChairSubmitDERequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            Gate::authorize('submitDeskEvaluationAuthorize', [$request]);


            $validated = $request->validated();
            if (self::canSubmitDeskEvaluation($validated['pgpr_id'])) {
                // the desk evaluation can be submitted
                $grading = ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated['pgpr_id'], stage: 'DE');
                // since the desk evaluation is completed, automatically create the proper evaluation

                DB::beginTransaction();
                $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
                $deskEvaluation = $pgpr->deskEvaluations;

                $properEvaluation = new ProperEvaluation();
                $properEvaluation->pgpr_id = $validated['pgpr_id'];
                $properEvaluation->start_date = Carbon::today();
                $properEvaluation->end_date = NULL;
                $properEvaluation->stage = '1';

                $properEvaluation1 = new ProperEvaluation1([
                    'start_date' => Carbon::today(),
                    'pe_1_meeting_date' => NULL,
                    'end_date' => NULL,
                    'remark' => 'None'
                ]);
                $properEvaluation->save();
                $properEvaluation->properEvaluation1()->save($properEvaluation1);
                $deskEvaluation->status = 'COMPLETED';
                $deskEvaluation->save();
                $pgpr -> status_of_pgpr = 'PE1';
                $pgpr -> save();

                // send the mails as well
                // to the dean, program coordinator, qac officer
                $pgp = $pgpr->postGraduateProgram;
                $programCoordinator = User::find($pgp->programme_coordinator_id);
                $faculty = $pgp->faculty;
                $university = $faculty->university;
                $dean = User::find($faculty->currentDean->id);

                //sending the mail to the qac director
                $qacDirectors = User::whereJsonContains('roles', 'qac_director')->get();

                foreach ($qacDirectors as $qacDirector) {
                    Mail::to($qacDirector->official_email)
                        ->send(new InformEvaluationSubmissionToOfficials(
                            recipient: $qacDirector,
                            subject: "The desk evaluation of the {$pgp->title} was concluded.",
                            content: 'mail.informEvaluationSubmissionToOfficials',
                            pgp: $pgp,
                            faculty: $faculty,
                            university: $university,
                            data: $grading,
                        )
                    );
                }

                // dean
                Mail::to(
                    $dean->official_email
                )->send(
                    new InformEvaluationSubmissionToOfficials(
                        recipient: $dean,
                        subject: "The desk evaluation of the {$pgp->title} was concluded.",
                        content: 'mail.informEvaluationSubmissionToOfficials',
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
                        subject: "The desk evaluation of the {$pgp->title} was concluded.",
                        content: 'mail.informEvaluationSubmissionToOfficials',
                        pgp: $pgp,
                        faculty: $faculty,
                        university: $university,
                        data: $grading,
                    )
                );
                DB::commit();
                return response()->json(['message' => 'The desk evaluation was successfully submitted', 'data' => $grading], 200);
            }
            // the desk evaluation cannot be submitted
            return response()->json([
                'message' => 'The desk evaluation cannot be submitted yet, there are some inconsistencies with the scores provided by the review team, please check the progress.',
                'data' => []
            ], 422);

        } catch (AuthorizationException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        } catch (Exception $exception) {
            throw $exception;
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    private function canSubmitDeskEvaluation($pgprId): bool
    {
        $reviewTeam = DB::table('review_teams')->where('pgpr_id', $pgprId)->first();
        $pgpr = PostGraduateProgramReview::find($pgprId);
        $pgp = $pgpr->postGraduateProgram;
        $deskEvaluation = $pgpr->deskEvaluations;

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
                    ->where('desk_evaluation_id', $deskEvaluation->id)
                    ->where('standard_id', $standard->id)
                    ->pluck('de_score');

                if ($scores->isEmpty() || $scores->count() != 3 || $scores->unique()->count() > 1) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     *
     * POST request +>
     *              {
     *                  pgpr: 10
     *              }
     *
     */
    public function submitProperEvaluation(UpdateReviewChairSubmitPERequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            Gate::authorize('submitProperEvaluationAuthorize', [$request]);

            $validated = $request->validated();
            if (self::canSubmitProperEvaluation($validated['pgpr_id'])) {
                // the proper evaluation can be submitted
                $grading = ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated['pgpr_id'], stage: 'PE');
                $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);

                // send the mails as well
                // to the dean, program coordinator, qac officer
                $pgp = $pgpr->postGraduateProgram;
                $programCoordinator = User::find($pgp->programme_coordinator_id);
                $faculty = $pgp->faculty;
                $university = $faculty->university;
                $dean = User::find($faculty->currentDean->id);

                DB::beginTransaction();

                //sending the mail to the qac director
                $qacDirectors = User::whereJsonContains('roles', 'qac_director')->get();

                foreach ($qacDirectors as $qacDirector) {
                    Mail::to($qacDirector->official_email)
                        ->send(new InformEvaluationSubmissionToOfficials(
                            recipient: $qacDirector,
                            subject: "The proper evaluation of the {$pgp->title} was concluded.",
                            content: 'mail.EvaluationSubmissionToOfficial',
                            pgp: $pgp,
                            faculty: $faculty,
                            university: $university,
                            data: $grading,
                        )
                    );
                }
                // dean
                Mail::to(
                    $dean->official_email
                )->send(
                    new InformEvaluationSubmissionToOfficials(
                        recipient: $dean,
                        subject: "The proper evaluation of the {$pgp->title} was concluded.",
                        content: 'mail.EvaluationSubmissionToOfficial',
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
                        subject: "The proper evaluation of the {$pgp->title} was concluded.",
                        content: 'mail.EvaluationSubmissionToOfficial',
                        pgp: $pgp,
                        faculty: $faculty,
                        university: $university,
                        data: $grading,
                    )
                );

                $pgpr->properEvaluations->stage = 'COMPLETED';
                $pgpr->properEvaluations->save();

                $pgpr->status_of_pgpr = 'FINAL';
                $pgpr->save();

                DB::commit();
                return response()->json(['message' => 'The proper evaluation was successfully submitted', 'data' => $grading]);
            }
            // the proper evaluation cannot be submitted
            return response()->json([
                'message' => 'The proper evaluation cannot be submitted yet, there are some inconsistencies with the scores provided by the review team, please check the progress.',
                'data' => []
            ], 400);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => $e->getMessage()], 403);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    private function canSubmitProperEvaluation($pgprId): bool
    {
        $reviewTeam = DB::table('review_teams')->where('pgpr_id', $pgprId)->first();
        $reviewers = DB::table('reviewer_review_teams')->where('review_team_id', $reviewTeam->id)->pluck('reviewer_id');
        $pgpr = PostGraduateProgramReview::find($pgprId);
        $pgp = $pgpr->postGraduateProgram;
        $properEvaluation = $pgpr->properEvaluations;

        if (!$reviewTeam) {
            return false;
        }

        $assignedCriteria = Criteria::all()->pluck('id');

        foreach ($assignedCriteria as $assignedCriterion) {
            // Get all standards for this criteria
            $standards = StandardService::getApplicableStandards(
                $pgp->slqf_level,
                $pgp->is_professional_pg_programme,
                $assignedCriterion
            );

            foreach ($standards as $standard) {
                // Get all scores for this standard
                $scores = DB::table('proper_evaluation_score')
                    ->whereIn('reviewer_id', $reviewers)
                    ->where('proper_evaluation_id', $properEvaluation->id)
                    ->where('standard_id', $standard->id)
                    ->pluck('pe_score');
                if ($scores->isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     *
     * review chair can view summary of desk evaluation grades of each member of the team(including himself)
     * /{pgpr}/{criteria}/{standard}
     *
     */
    public function viewDEScoresOfEachStandardOfEachTeamMember(ShowDEScoresOfReviewTeamRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateProgramReview = PostGraduateProgramReview::find($validated['pgpr_id']);
            $deskEvaluation = $postGraduateProgramReview->deskEvaluations;

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
     *  /{pgpr}/{reviewer}/{criteria}/{standard}
     *               or
     *  /{pgpr}/{reviewer}
     *              or
     *   /{pgpr}/{reviewer}/{criteria}
     */
    public function viewDEScoresOfTeamMember(ShowDEScoresOfTeamMemberRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateProgramReview = PostGraduateProgramReview::find($validated['pgpr_id']);
            $deskEvaluation = $postGraduateProgramReview->deskEvaluations;

            if ($deskEvaluation) {
                $data = [];
                if (array_key_exists('criteria_id', $validated)) {
                    if (array_key_exists('standard_id', $validated)) {
                        $data = DB::table('desk_evaluation_score')
                            ->join('standards', 'desk_evaluation_score.standard_id', '=', 'standards.id')
                            ->join('criterias', 'standards.criteria_id', '=', 'criterias.id')
                            ->join('users', 'users.id', '=', 'desk_evaluation_scores.reviewer_id')
                            ->where('desk_evaluation_score.desk_evaluation_id', $deskEvaluation->id)
                            ->where('desk_evaluation_score.reviewer_id', $validated['reviewer_id'])
                            ->where('desk_evaluation_score.standard_id', $validated['standard_id'])
                            ->where('criterias.id', $validated['criteria_id'])
                            ->select(
                                'users.full_name as reviewerFullName',
                                'desk_evaluation_score.reviewer_id as reviewerId',
                                'standards.standard_no as standardNo',
                                'standards.description as standardDescription',
                                'desk_evaluation_score.de_score as deScore',
                                'desk_evaluation_score.comment as comment',
                            )
                            ->get();
                    } else {
                        $standardIds = Criteria::find($validated['criteria_id'])->standards->pluck('id');
                        $reviewerName = Reviewer::find($validated['reviewer_id'])->user->full_name;
                        $data['reviewerName'] = $reviewerName;
                        $data['scores'] = DB::table('desk_evaluation_score')
                            ->join('standards', 'desk_evaluation_score.standard_id', '=', 'standards.id')
                            ->join('criterias', 'standards.criteria_id', '=', 'criterias.id')
                            ->where('desk_evaluation_score.desk_evaluation_id', $deskEvaluation->id)
                            ->where('desk_evaluation_score.reviewer_id', $validated['reviewer_id'])
                            ->whereIn('desk_evaluation_score.standard_id', $standardIds)
                            ->select(
                                'desk_evaluation_score.reviewer_id as reviewerId',
                                'standards.standard_no as standardNo',
                                'standards.description as standardDescription',
                                'desk_evaluation_score.de_score as deScore',
                                'desk_evaluation_score.comment as comment',
                            )
                            ->get();
                    }
                }else {
                    $criteriaIds = DB::table('criterias')->pluck('id');
                    $reviewerName = Reviewer::find($validated['reviewer_id'])->user->full_name;
                    $data['scores'] =[];
                    foreach ($criteriaIds as $criteriaId) {
                        $standardIds = Criteria::find($criteriaId)->standards->pluck('id');

                        $data['scores'][] = DB::table('desk_evaluation_score')
                            ->join('standards', 'criterias.id', '=', 'standards.criteria_id')
                            ->join('criterias', 'standards.criteria_id', '=', 'criterias.id')
                            ->where('desk_evaluation_score.desk_evaluation_id', $deskEvaluation->id)
                            ->where('desk_evaluation_score.reviewer_id', $validated['reviewer_id'])
                            ->whereIn('desk_evaluation_score.standard_id', $standardIds)
                            ->select(
                                'desk_evaluation_score.reviewer_id as reviewerId',
                                'standards.standard_no as standardNo',
                                'standards.description as standardDescription',
                                'desk_evaluation_score.de_score as deScore',
                                'desk_evaluation_score.comment as comment',
                            )
                            ->get();
                    }

                }
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
     * review chair can view summary of proper evaluation grades of each member of the team(including himself)
     * /{pgpr}/{criteria}
     *
     */
    public function viewPEScoresOfEachStandardOfEachTeamMember(ShowPEScoresOfReviewTeamRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $postGraduateProgramReview = PostGraduateProgramReview::find($validated['pgpr_id']);
            $properEvaluation = $postGraduateProgramReview->properEvaluations;

            if ($properEvaluation) {
                $standardIds = Criteria::find($validated['criteria_id'])->standards->pluck('id');
                $data = DB::table('proper_evaluation_score')
                    ->join('standards', 'proper_evaluation_score.standard_id', '=', 'standards.id')
                    ->join('criterias', 'standards.criteria_id', '=', 'criterias.id')
                    ->where('proper_evaluation_id', $properEvaluation->id)
                    ->whereIn('proper_evaluation_score.standard_id', $standardIds)
                    ->select('standards.id as standardId','standards.standard_no as standardNo', 'proper_evaluation_score.pe_score as peScore', 'proper_evaluation_score.comment as comment')
                    ->get();
                return response()->json(['message' => 'Successful', 'data' => $data]);
            } else {
                return response()->json(
                    ['message' => 'Proper evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        } catch (Exception $exception) {
            // return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
            throw $exception; 
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
            Gate::authorize('updatePEScoresOfEachStandardAuthorize', [$request]);

            $validated = $request->validated();
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($validated['pgpr_id']);
            $properEvaluation = $postGraduateReviewProgram->properEvaluations;

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
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e->getMessage()], 403);

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
    public function updateDEScoresOfEachStandard(StoreConductDeskEvaluationRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            Gate::authorize('updateDEScoresOfEachStandardAuthorize', [$request]);

            $validated = $request->validated();
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($validated['pgpr_id']);
            $deskEvaluation = $postGraduateReviewProgram->deskEvaluations;

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
        }catch(AuthorizationException $e){
            return response()->json(['message' => $e->getMessage()], 403);

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
     *                {
     *                    pgpr: 10,
     *                    file: abc.pdf,
     *                }
     */
    public function uploadPreliminaryReport(UploadPreliminaryReportRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();

            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $reviewTeam = $pgpr->reviewTeam;

            $file = $validated['file'];
            $date = Carbon::today();
            //move the file and create the file name
            $fileName = Str::random(10) . '_' . "{$pgpr->id}-{$reviewTeam->id}-{$date}" . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('review_chair_upload_preliminary_reports', $fileName, 'public');

            $attributes = [
                'pgpr_id' => $validated['pgpr_id'],
                'review_team_id' => $reviewTeam->id
            ];
            $data = [
                'preliminary_report' => Storage::disk('public')->url($path),
                'type' => 'PRELIMINARY'
            ];

            DB::beginTransaction();

            DB::table('final_reports')->updateOrInsert($attributes, $data);

            $pgp = $pgpr->postGraduateProgram;
            $programCoordinator = User::find($pgp->programme_coordinator_id);
            $faculty = $pgp->faculty;
            $university = $faculty->university;
            $dean = User::find($faculty->currentDean->id);

            //sending the mail to the qac director
            $qacDirectors = User::whereJsonContains('roles', 'qac_director')->get();

            foreach ($qacDirectors as $qacDirector) {
                Mail::to($qacDirector->official_email)
                    ->send(new InformReportUploadsToOfficials(
                    recipient: $qacDirector,
                    subject: "Final report of the post-graduate program review {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentUploads',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'PRELIMINARY'
                ));
            }

            // dean
            Mail::to($dean->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $dean,
                    subject: "Final report of the post-graduate program review {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentUploads',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'PRELIMINARY'
                )
            );

            // program coordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $programCoordinator,
                    subject: "Final report of the post-graduate program review {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentUploads',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'PRELIMINARY'
                )
            );

            DB::commit();
            return response()->json(['message' => 'File successfully uploaded']);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * POST request +>
     *                {
     *                    pgpr: 10,
     *                    file: abc.pdf,
     *                }
     */
    public function uploadFinalReport(UploadFinalReportRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();

            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $reviewTeam = $pgpr->reviewTeam;

            $file = $validated['file'];
            $date = Carbon::today();
            //move the file and create the file name
            $fileName = Str::random(10) . '_' . "{$pgpr->id}-{$reviewTeam->id}-{$date}" . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('review_chair_upload_final_reports', $fileName, 'public');

            $attributes = [
                'pgpr_id' => $validated['pgpr_id'],
                'review_team_id' => $reviewTeam->id
            ];
            $data = [
                'final_report' => Storage::disk('public')->url($path),
                'type' => 'FINAL'
            ];

            DB::beginTransaction();

            DB::table('final_reports')->updateOrInsert($attributes, $data);

            $pgp = $pgpr->postGraduateProgram;
            $programCoordinator = User::find($pgp->programme_coordinator_id);
            $faculty = $pgp->faculty;
            $university = $faculty->university;
            $dean = User::find($faculty->currentDean->id);

            //sending the mail to the qac director
            $qacDirectors = User::whereJsonContains('roles', 'qac_director')->get();

            foreach ($qacDirectors as $qacDirector) {
                Mail::to($qacDirector->official_email)
                    ->send(new InformReportUploadsToOfficials(
                        recipient: $qacDirector,
                        subject: "Final report of the post-graduate program reivew {$pgp->title}",
                        content: 'mail.informOfficialsAboutOfficialDocumentUploads',
                        pgp: $pgp,
                        university: $university,
                        faculty: $faculty,
                        type: 'FINAL'
                    )
                );
            }

            // dean
            Mail::to($dean->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $dean,
                    subject: "Final report of the post-graduate program reivew {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentUploads',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'FINAL'
                )
            );

            // program coordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $programCoordinator,
                    subject: "Final report of the post-graduate program reivew {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentUploads',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'FINAL'
                )
            );

            DB::commit();
            return response()->json(['message' => 'File successfully uploaded']);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * POST request +>
     *                {
     *                    pgpr: 10,
     *                }
     * @throws ValidationException
     */
    public function submitPreliminaryReport(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pgpr' => [
                'required',
                'exists:post_graduate_program_reviews,id',
                function ($attribute, $value, $fail) {
                    $pgpr = PostGraduateProgramReview::find($value);
                    if ($pgpr->status_of_pgpr != 'PE2') {
                        $fail('The post graduate review program is not in an updatable state.');
                    }
                },
                function ($attribute, $value, $fail) {
                    $pgpr = PostGraduateProgramReview::find($value);
                    $reviewTeam = $pgpr->reviewTeam;

                    $report = DB::table('final_reports')
                        ->select('preliminary_report')
                        ->where('pgpr_id', $pgpr->id)
                        ->where('reviewer_team_id', $reviewTeam->id)
                        ->first();
                    if (!$report) {
                        $fail('The post graduate review program does not have a preliminary report for you to submit.');
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
            $pgpr = PostGraduateProgramReview::find($validated['pgpr']);
            $pgp = $pgpr->postGraduateProgram;
            $programCoordinator = User::find($pgp->programme_coordinator_id);
            $faculty = $pgp->faculty;
            $university = $faculty->university;
            $dean = User::find($faculty->currentDean->id);

            //sending the mail to the qac director
            $qacDirectors = User::whereJsonContains('roles', 'qac_director')->get();

            foreach ($qacDirectors as $qacDirector) {
                Mail::to($qacDirector->official_email)->send(
                     new InformReportUploadsToOfficials(
                         recipient: $qacDirector,
                         subject: "Final report of the post-graduate program reivew {$pgp->title}",
                         content: 'mail.informOfficialsAboutOfficialDocumentSubmissions',
                         pgp: $pgp,
                         university: $university,
                         faculty: $faculty,
                         type: 'PRELIMINARY'
                     )
                );
            }

            // dean
            Mail::to($dean->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $dean,
                    subject: "Final report of the post-graduate program reivew {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentSubmissions',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'PRELIMINARY'
                )
            );

            // program coordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $programCoordinator,
                    subject: "Final report of the post-graduate program reivew {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentSubmissions',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'PRELIMINARY'
                )
            );
            $pgpr->status_of_pgpr = 'FINAL';
            $pgpr->save();
            DB::commit();

            return response()->json(['message' => 'File successfully submitted.']);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * POST request +>
     *                {
     *                    pgpr: 10,
     *                }
     * @throws ValidationException
     */
    public function submitFinalReport(Request $request): \Illuminate\Http\JsonResponse
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

                    $report = DB::table('final_reports')
                        ->select('final_report')
                        ->where('pgpr_id', $pgpr->id)
                        ->where('reviewer_team_id', $reviewTeam->id)
                        ->first();
                    if (!$report) {
                        $fail('The post graduate review program does not have a final report for you to submit.');
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
            $pgpr = PostGraduateProgramReview::find($validated['pgpr']);
            $reviewTeam = $pgpr->reviewTeam;
            $pgp = $pgpr->postGraduateProgram;
            $programCoordinator = User::find($pgp->programme_coordinator_id);
            $faculty = $pgp->faculty;
            $university = $faculty->university;
            $dean = User::find($faculty->currentDean->id);


            //sending the mail to the qac director
            $qacDirectors = User::whereJsonContains('roles', 'qac_director')->get();

            foreach ($qacDirectors as $qacDirector) {
                Mail::to($qacDirector->official_email)->send(
                    new InformReportUploadsToOfficials(
                        recipient: $qacDirector,
                        subject: "Final report of the post-graduate program reivew {$pgp->title}",
                        content: 'mail.informOfficialsAboutOfficialDocumentSubmissions',
                        pgp: $pgp,
                        university: $university,
                        faculty: $faculty,
                        type: 'FINAL'
                    )
                );
            }

            // dean
            Mail::to($dean->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $dean,
                    subject: "Final report of the post-graduate program reivew {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentSubmissions',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'FINAL'
                )
            );

            // program coordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformReportUploadsToOfficials(
                    recipient: $programCoordinator,
                    subject: "Final report of the post-graduate program reivew {$pgp->title}",
                    content: 'mail.informOfficialsAboutOfficialDocumentSubmissions',
                    pgp: $pgp,
                    university: $university,
                    faculty: $faculty,
                    type: 'FINAL'
                )
            );

            DB::table('final_reports')
                ->where('pgpr_id', $pgpr->id)
                ->where('review_team_id', $reviewTeam->id)
                ->update(['type' => 'SUBMITTED']);

            DB::commit();
            return response()->json(['message' => 'File successfully submitted.']);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /*
     * pgprId=10
     * startDate=
     * pe1MeetingDate
     * endDate
     * remark
     *
     */
    public function setDatesForPE1(SetDatesForPE1Request $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $properEvaluation1 = PostGraduateProgramReview::find($validated['pgpr_id'])->properEvaluations->properEvaluation1;
            unset($validated['pgpr_id']);
            $properEvaluation1->update($validated);
            return response()->json(['message' => 'The update operation was successful']);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /*
     * pgprId=10
     * startDate
     * siteVisitStartDate
     * siteVisitEndDate
     * endDate
     * remark
     */
    public function setDatesForPE2(SetDatesForPE2Request $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $properEvaluation2 = PostGraduateProgramReview::find($validated['pgpr_id'])->properEvaluations->properEvaluation2;
            unset($validated['pgpr_id']);
            $properEvaluation2->update($validated);
            return response()->json(['message' => 'The update operation was successful']);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }
}
