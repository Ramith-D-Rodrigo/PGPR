<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\ShowFinalGradeOfDeskEvaluationRequest;
use App\Http\Requests\V1\ShowFinalGradeOfProperEvaluationRequest;
use App\Http\Requests\V1\ShowFinalReportRequest;
use App\Http\Requests\V1\ShowPreliminaryReportRequest;
use App\Http\Requests\V1\ShowProperEvaluationDetailsOfReviewTeamRequest;
use App\Http\Requests\V1\StoreReviewTeamRequest;
use App\Http\Requests\V1\UpdateReviewTeamRequest;
use App\Http\Resources\V1\CriteriaResource;
use App\Http\Resources\V1\ReviewTeamCollection;
use App\Http\Resources\V1\ReviewTeamResource;
use App\Http\Resources\V1\UserResource;
use App\Mail\InformDeanOfReviewTeamAssignment;
use App\Mail\InformReviewerOfReviewAssignment;
use App\Mail\InformReviewTeamActionToAuthorities;
use App\Models\Criteria;
use App\Models\PostGraduateProgramReview;
use App\Models\Reviewer;
use App\Models\ReviewTeam;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\V1\ScoreCalculationService;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ReviewTeamController extends Controller
{
    /**
     * Display a listing of the resource.
     * If there is a pgprId then send that particular review team
     * else send all the review teams
     */
    public function index(Request $request): JsonResponse|ReviewTeamCollection|ReviewTeamResource
    {
        try {
            $this->authorize('viewAny', ReviewTeam::class);

            if (($pgprId = $request->query('pgprId')) !== null) {
                try {
                    //find the pgpr
                    $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($pgprId)->load('reviewTeam');
                    $reviewTeam = $postGraduateReviewProgram->reviewTeam->load('reviewers');
                    return new ReviewTeamResource($reviewTeam);
                } catch (ModelNotFoundException $exception) {
                    return response()->json(["message" => "There is not such review program in our databases."], 400);
                }
            } else {
                $teams = ReviewTeam::all()->load('reviewers');
                return new ReviewTeamCollection($teams);
            }
        } catch (AuthorizationException $e) {
            return response()->json(["message" => $e->getMessage()], 403);
        } catch (Exception $exception) {
            return response()->json(["message" => "Something bad happened!, We are working on it."], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * SEND THE PGPR ID WITH THE POST REQUEST
     * Data needed: quality_assurance_officer_id, dean_id, status(PENDING),
     *               Three reviewers must be sent with this POST request
     *
     */
    public function store(StoreReviewTeamRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', ReviewTeam::class);

            // get the id from logged-in user
            //(at this point the user is either a qac officer or a director it is validated)
            $qac = Auth::user(); // since the auth user must be a qac
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($request->validated('pgpr_id')); // find the PGPR

            if ($postGraduateReviewProgram->reviewTeam && $postGraduateReviewProgram->reviewTeam->whereIn('status', ['PENDING', 'APPROVED'])) {
                return response()->json(['message' => 'This review already contains a review team you cannot add another review team'], 422);
            }

            $postGraduateProgram = $postGraduateReviewProgram->postGraduateProgram; // find the postgraduate program
            $faculty = $postGraduateProgram->faculty; // find the faculty
            $university = $faculty->university; // find the university
            $dean = $faculty->deans[0]->user; // find the dean of the faculty

            DB::beginTransaction();

            $reviewTeam = new ReviewTeam();
            $reviewTeam->quality_assurance_council_officer_id = $qac->id;
            $reviewTeam->pgpr_id = $postGraduateReviewProgram->id;
            $reviewTeam->dean_id = $dean->id;
            $reviewTeam->status = "PENDING";
            $reviewTeam->dean_decision = "N/A";
            $reviewTeam->remarks = "N/A";

            $reviewTeam->save();

            $reviewers = [];

            $validatedReviewers = $request->validated('reviewers');

            // add the reviewer data to the pivot table
            foreach ($validatedReviewers as $reviewer) {
                $reviewTeam->reviewers()->attach(
                    $reviewer['reviewer_id'],
                    [
                        'role' => $reviewer['position'],
                        'review_team_id' => $reviewTeam->id,
                        'reviewer_confirmation' => 'PENDING',
                        'declaration_letter' => NULL
                    ]
                );
                $user = User::find($reviewer['reviewer_id']);
                $user->position = $reviewer['position'];    //to send the mail
                $reviewers[] = $user;
            }


            foreach ($reviewers as $reviewer) {
                Mail::to($reviewer->official_email)
                    ->send(
                        new InformReviewerOfReviewAssignment(
                            $reviewer,
                            $postGraduateProgram,
                            $university,
                            $faculty,
                            'Assignment of review team membership',
                            'mail.reviewerReviewTeamAssignment'
                        )
                    );
            }

            // send the mail to the dean
            Mail::to($dean->official_email)
                ->send(
                    new InformDeanOfReviewTeamAssignment(
                        $dean,
                        $postGraduateProgram,
                        $reviewers,
                        "Assignment of review team to postgraduate program review",
                        "mail.deanReviewTeamAssignment"
                    )
                );

            DB::commit();
            return response()->json(["message" => "Review team was successfully added.", "data" => new ReviewTeamResource($reviewTeam->load('reviewers'))]);
        } catch (AuthorizationException $exception) {
            return response()->json(["message" => $exception->getMessage()], 403);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(["message" => "Something bad happened!, We are working on it."], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse|ReviewTeamResource
    {
        try {
            $this->authorize('view', ReviewTeam::class);

            //find the review team
            $reviewTeam = ReviewTeam::findOrFail($id)->load('reviewers');
            return new ReviewTeamResource($reviewTeam);
        } catch (AuthorizationException $e) {
            return response()->json(["message" => $e->getMessage()], 403);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "There is not such review program in our databases."], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Something bad happened!, We are working on it."], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewTeamRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * Only rejected review teams can be removed
     * And only by the QAC Director
     *
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->authorize('forceDelete', ReviewTeam::class);

            // find the reviewer team
            $reviewTeam = ReviewTeam::findOrFail($id)->load('reviewers');

            if ($reviewTeam->status == 'ACCEPTED') {
                return response()->json(["message" => "This review team cannot be deleted."]);
            }

            DB::beginTransaction();

            $qacOfficer = $reviewTeam->qualityAssuranceCouncilOfficer->user;
            $postGraduateProgram = $reviewTeam->postGraduateReviewProgram->postGraduateProgram;
            $faculty = $postGraduateProgram->faculty;
            $university = $faculty->university;
            $dean = $faculty->currentDean->user;
            $reviewers = $reviewTeam->reviewers;

            // TODO: INFORM DEAN, AND THE REVIEW TEAM
            Mail::to($dean->official_email)->send(
                new InformReviewTeamActionToAuthorities(
                    user: $dean,
                    action: 'REMOVED',
                    faculty: $faculty,
                    university: $university,
                    postGraduateProgram: $postGraduateProgram,
                    reviewTeamInfo: $reviewers,
                    subject: 'Review team assigned to the a postgraduate program was removed',
                    content: 'mail.informReviewTeamActionToAuthorities',
                )
            );

            Mail::to($qacOfficer->official_email)->send(
                new InformReviewTeamActionToAuthorities(
                    user: $qacOfficer,
                    action: 'REMOVED',
                    faculty: $faculty,
                    university: $university,
                    postGraduateProgram: $postGraduateProgram,
                    reviewTeamInfo: $reviewers,
                    subject: 'Review team assigned to the a postgraduate program was removed',
                    content: 'mail.informReviewTeamActionToAuthorities',
                )
            );

            foreach ($reviewers as $reviewer) {
                Mail::to($reviewer->user->official_email)->send(
                    new InformReviewTeamActionToAuthorities(
                        user: $reviewer->user,
                        action: 'REMOVED',
                        faculty: $faculty,
                        university: $university,
                        postGraduateProgram: $postGraduateProgram,
                        reviewTeamInfo: $reviewers,
                        subject: 'Review team assigned to the a postgraduate program was removed',
                        content: 'mail.informReviewTeamActionToAuthorities',
                    )
                );
            }

            $reviewTeam->reviewers()->detach(); // remove the reviewers first
            $reviewTeam->delete(); // delete the review team
            DB::commit();
            return response()->json(['message' => 'The requested review team was deleted from the database.', 'data' => new ReviewTeamResource($reviewTeam)]);
        } catch (AuthorizationException $e) {
            return response()->json(["message" => $e->getMessage()], 403);
        } catch (ModelNotFoundException $exception) {
            DB::rollBack();
            return response()->json(["message" => "There is not such review team in our databases."], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Something bad happened!, We are working on it."], 500);
        }
    }

    /**
     * Reviewer views PE details of review team
     * {
     *     reviewTeam: 12,
     *     pgpr: 1,
     * }
     *
     */

    public function viewProperEvaluationDetails(ShowProperEvaluationDetailsOfReviewTeamRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $reviewerRecords = DB::table('review_team_set_criterias')
                ->where('review_team_id', $validated['review_team_id'])
                ->where('pgpr_id', $validated['pgpr_id'])
                ->groupBy(['assigned_to_reviewer_id', 'criteria_id'])
                ->get();

            if ($reviewerRecords->isEmpty()) {
                return response()->json(['message' => 'Seems the criteria have not been assigned yet.', 'data' => []]);
            }

            $data = [];

            $reviewerRecordsTemp = [];
            foreach ($reviewerRecords as $record) {
                $reviewerRecordsTemp[$record->assigned_to_reviewer_id][] = $record;
            }

            foreach ($reviewerRecordsTemp as $reviewerId => $records) {
                $temp = [];
                $temp['reviewer'] = new UserResource(Reviewer::find($reviewerId)->user);
                $temp['criteria'] = [];
                foreach ($records as $record) {
                    $temp['criteria'][] = new CriteriaResource(Criteria::find($record->criteria_id)->load('standards'));
                }
                $data[] = $temp;
            }
            return response()->json(['message' => 'Successful', 'data' => $data]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'Something bad happened!, We are working on it.'], 500);
        }
    }

    // To view the grades, the review must have completed the desk evaluation phase of the review
    public function viewFinalGradesOfDeskEvaluation(ShowFinalGradeOfDeskEvaluationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            return response()->json([
                'message' => 'Successful',
                'data' => ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated['pgpr_id'], stage: 'DE')
            ]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'Something bad happened!, We are working on it.'], 500);
        }
    }

    public function viewFinalGradesOfProperEvaluation(ShowFinalGradeOfProperEvaluationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            return response()->json([
                'message' => 'Successful',
                'data' => ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated['pgpr_id'], stage: 'PE')
            ]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'Something bad happened!, We are working on it.'], 500);
        }
    }

    /**
     * If the preliminary report is uploaded, then it can be downloaded
     * GET request +>
     *                /{pgpr}
     */
    public function viewPreliminaryReport(ShowPreliminaryReportRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $reviewTeam = $pgpr->reviewTeam;

            $data = DB::table('final_reports')
                ->select('preliminary_report as preliminaryReport', 'created_at as createdAt', 'updated_at as updatedAt')
                ->where('pgpr_id', $pgpr->id)
                ->where('review_team_id', $reviewTeam->id)
                ->first();

            if (!$data) {
                return response()->json(['message' => 'The preliminary report is not yet uploaded.']);
            }

            return response()->json(['message' => 'Success', 'data' => $data]);

        } catch (Exception $exception) {
            return response()->json(['message' => 'Something bad happened!, We are working on it.'], 500);
        }
    }

    /**
     * If the final report is uploaded then it can be downloaded
     * GET request +>
     *                /{pgpr}
     */
    public function viewFinalReport(ShowFinalReportRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $reviewTeam = $pgpr->reviewTeam;

            $data = DB::table('final_reports')
                ->select('final_report as finalReport', 'created_at as createdAt', 'updated_at as updatedAt')
                ->where('pgpr_id', $pgpr->id)
                ->where('review_team_id', $reviewTeam->id)
                ->first();

            if (!$data) {
                return response()->json(['message' => 'The final report is not yet uploaded.']);
            }

            return response()->json(['message' => 'Success', 'data' => $data]);

        } catch (Exception $exception) {
            return response()->json(['message' => 'Something bad happened!, We are working on it.'], 500);
        }
    }
}
