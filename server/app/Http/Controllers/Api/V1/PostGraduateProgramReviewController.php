<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\ShowFinalReportRequest;
use App\Http\Requests\V1\ShowPreliminaryReportRequest;
use App\Http\Requests\V1\StorePostGraduateProgramReviewRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramReviewRequest;
use App\Http\Resources\V1\PostGraduateProgramReviewCollection;
use App\Http\Resources\V1\PostGraduateProgramReviewResource;
use App\Mail\InformDeanOfReviewTeamAssignment;
use App\Mail\InformReviewerOfReviewAssignment;
use App\Models\PostGraduateProgramReview;
use App\Http\Controllers\Controller;
use App\Models\ReviewTeam;
use App\Models\User;
use App\Services\V1\ScoreCalculationService;
use App\Services\V1\StandardService;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PostGraduateProgramReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $this->authorize('viewAny', PostGraduateProgramReview::class);

            //load related data
            $pgprs = PostGraduateProgramReview::with([
                'postGraduateProgram' => [
                    'faculty' => [
                        'university'
                    ]
                ],
                'selfEvaluationReport:id,post_graduate_program_review_id,pgp_coordinator_id' => [
                    'programmeCoordinator:id' => [
                        'academicStaff:id' => [
                            'universitySide:id' => [
                                'user:id,initials,surname,profile_pic'
                            ]
                        ]
                    ]
                ],
                'postGraduateProgramReviewApplication'
            ]);

            $neededPGPRStatus = request() -> query('status');

            if($neededPGPRStatus){
                $neededPGPRStatus = explode(',', $neededPGPRStatus);
                $pgprs = $pgprs->whereIn('status_of_pgpr', $neededPGPRStatus);
            }

            $includeDE = request() -> query('includeDE');
            $includePE = request() -> query('includePE');

            if($includeDE) {
                $pgprs = $pgprs -> with(['deskEvaluations']);
            }

            if($includePE) {
                $pgprs = $pgprs -> with(['properEvaluations']);
            }

            return new PostGraduateProgramReviewCollection($pgprs->get());
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occured while trying to fetch post graduate program reviews',
                'error' => $e->getMessage()
            ], 500);
        }
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
    public function store(StorePostGraduateProgramReviewRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgramReview $postGraduateProgramReview)
    {
        try {
            $this->authorize('view', $postGraduateProgramReview);

            //load related data
            $pgpr = $postGraduateProgramReview->load([
                'postGraduateProgram' => [
                    'faculty' => [
                        'university'
                    ],
                ],
                'selfEvaluationReport:id,post_graduate_program_review_id,pgp_coordinator_id' => [
                    'programmeCoordinator:id' => [
                        'academicStaff:id' => [
                            'universitySide:id' => [
                                'user:id,initials,surname,profile_pic'
                            ]
                        ]
                    ]
                ],
                'postGraduateProgramReviewApplication',
                'properEvaluations',
                'deskEvaluations',
                'acceptedReviewTeam' => [
                    'reviewers' => [
                        'user:id,initials,surname,profile_pic'
                    ]
                ],
                'finalReports',
                'pendingReviewTeam' => [
                    'reviewers' => [
                        'user:id,initials,surname,profile_pic'
                    ]
                ],
            ]);

            return new PostGraduateProgramReviewResource($pgpr);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostGraduateProgramReview $postGraduateProgramReview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramReviewRequest $request, PostGraduateProgramReview $postGraduateProgramReview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgramReview $postGraduateProgramReview)
    {
        //
    }

    public function groupWithAnotherPGPR(PostGraduateProgramReview $postGraduateProgramReviewOne, PostGraduateProgramReview $postGraduateProgramReviewTwo){
        try{
            $this -> authorize('groupWithAnotherPGPRAuthorize', [$postGraduateProgramReviewOne, $postGraduateProgramReviewTwo]);

            if($postGraduateProgramReviewOne -> id === $postGraduateProgramReviewTwo -> id){
                return response() -> json([
                    'message' => 'Cannot group a post graduate program review with itself'
                ], 400);
            }

            if(!in_array($postGraduateProgramReviewOne -> status_of_pgpr, ['PLANNING', 'SUBMITTED']) || !in_array($postGraduateProgramReviewTwo -> status_of_pgpr, ['PLANNING', 'SUBMITTED'])){
                return response() -> json([
                    'message' => 'Cannot group post graduate program reviews that are not in the planning or submitted stage'
                ], 400);
            }

            //check whether one of the reviews has a accepted review team
            if($postGraduateProgramReviewOne -> acceptedReviewTeam || $postGraduateProgramReviewTwo -> acceptedReviewTeam){
                return response() -> json([
                    'message' => 'Cannot group post graduate program reviews that have an accepted review team'
                ], 400);
            }

            $assigningReviewTeam = null;
            $toAssignPGPR = null;


            DB::beginTransaction();

            $postGraduateProgramReviewOne -> update([
                'grouped_with' => $postGraduateProgramReviewTwo -> id
            ]);

            $postGraduateProgramReviewTwo -> update([
                'grouped_with' => $postGraduateProgramReviewOne -> id
            ]);

            //check whether both review teams have the same pending review teams
            if($postGraduateProgramReviewOne -> pendingReviewTeam && $postGraduateProgramReviewTwo -> pendingReviewTeam){   //both have some pending review teams
                $flag = DB::table('reviewer_review_teams')
                -> join('reviewer_review_teams as rrt', 'reviewer_review_teams.reviewer_id', '=', 'rrt.reviewer_id')
                -> where('reviewer_review_teams.review_team_id', '=', $postGraduateProgramReviewOne -> pendingReviewTeam -> id)
                -> where('rrt.review_team_id', '=', $postGraduateProgramReviewTwo -> pendingReviewTeam -> id)
                -> count() == 3;

                if(!$flag){
                    DB::rollBack();
                    return response() -> json([
                        'message' => 'Cannot group post graduate program reviews that have different pending review teams'
                    ], 400);
                }
                else{
                    DB::commit();
                    return response() -> json([
                        'message' => 'Successfully grouped the post graduate program reviews'
                    ], 200);
                }
            }
            else if($postGraduateProgramReviewOne -> pendingReviewTeam){    //only first one has a review team that is pending
                $assigningReviewTeam = $postGraduateProgramReviewOne -> pendingReviewTeam;
                $toAssignPGPR = $postGraduateProgramReviewTwo;

            }
            else if($postGraduateProgramReviewTwo -> pendingReviewTeam){ //only two one has a review team that is pending
                $assigningReviewTeam = $postGraduateProgramReviewTwo -> pendingReviewTeam;
                $toAssignPGPR = $postGraduateProgramReviewOne;
            }
            else{
                DB::commit();
                return response() -> json([
                    'message' => 'Successfully grouped the post graduate program reviews'
                ], 200);
            }

            $faculty = $toAssignPGPR -> postGraduateProgram -> faculty;

            //assign the review team to the other post graduate program review
            $reviewTeam = new ReviewTeam();
            $reviewTeam->quality_assurance_council_officer_id = Auth::id();
            $reviewTeam->pgpr_id = $toAssignPGPR -> id;
            $reviewTeam->dean_id = $faculty -> currentDean ->id;
            $reviewTeam->status = "PENDING";
            $reviewTeam->dean_decision = "N/A";
            $reviewTeam->remarks = "N/A";

            $reviewTeam->save();

            $reviewers = [];

            $members = $assigningReviewTeam->reviewers;

            // add the reviewer data to the pivot table
            foreach ($members as $reviewer) {
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
                            $toAssignPGPR -> postGraduateProgram,
                            $toAssignPGPR -> $faculty -> university,
                            $toAssignPGPR -> $faculty,
                            'Assignment of review team membership',
                            'mail.reviewerReviewTeamAssignment'
                        )
                    );
            }

            // send the mail to the dean
            Mail::to($faculty -> currentDean -> academicStaff -> universitySide -> user ->official_email)
                ->send(
                    new InformDeanOfReviewTeamAssignment(
                        $faculty -> currentDean,
                        $toAssignPGPR -> postGraduateProgram,
                        $reviewers,
                        "Assignment of review team to postgraduate program review",
                        "mail.deanReviewTeamAssignment"
                    )
                );

            DB::commit();

            return response() -> json([
                'message' => 'Successfully grouped the post graduate program reviews'
            ], 200);
        }
        catch(AuthorizationException $e){
            return response() -> json([
                'message' => $e -> getMessage()
            ], 403);
        }
        catch(\Exception $e){
            DB::rollBack();

            return response() -> json([
                'message' => 'An error occurred while trying to group the post graduate program reviews',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    public function getDEScores(PostGraduateProgramReview $pgpr): JsonResponse
    {

        $validated = $pgpr->id;
        $grading = ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated, stage: 'DE');

        $pgpr = PostGraduateProgramReview::find($validated);
        $pgp = $pgpr->postGraduateProgram;
        $deskEvaluation = $pgpr->deskEvaluations;
        $reviewTeam = DB::table('review_teams')->where('pgpr_id', $validated)->first();

        $reviewers = DB::table('reviewer_review_teams')->where('review_team_id', $reviewTeam->id)->where('role', 'CHAIR')->pluck('reviewer_id');

        $criteria = DB::table('criterias')->get();

        $data = [];

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
                    ->select('de_score AS deScore', 'standard_id AS standardId')
                    ->get();

                $data[$criterion->id][$standard->id] = $scores;
            }
        }

        return response()->json(["finalGrades" => $grading, 'StandardScores' => $data]);
    }

    public function getPEScores(PostGraduateProgramReview $pgpr): JsonResponse
    {
        $validated = $pgpr->id;
        $grading = ScoreCalculationService::gradeObtainedByTheProgramOfStudy(pgprId: $validated, stage: 'PE');

        $pgpr = PostGraduateProgramReview::find($validated);
        $pgp = $pgpr->postGraduateProgram;
        $properEvaluation = $pgpr->properEvaluations;
        $reviewTeam = DB::table('review_teams')->where('pgpr_id', $validated)->first();

        $reviewers = DB::table('reviewer_review_teams')->where('review_team_id', $reviewTeam->id)->pluck('reviewer_id');

        $criteria = DB::table('criterias')->get();

        $data = [];

        foreach ($criteria as $criterion) {
            // Get all standards for this criteria
            $standards = StandardService::getApplicableStandards(
                $pgp->slqf_level,
                $pgp->is_professional_pg_programme,
                $criterion->id
            );

            foreach ($standards as $standard) {
                // Get all scores for this standard
                $scores = DB::table('proper_evaluation_score')
                    ->whereIn('reviewer_id', $reviewers)
                    ->where('proper_evaluation_id', $properEvaluation->id)
                    ->where('standard_id', $standard->id)
                    ->select('pe_score AS peScore', 'standard_id AS standardId')
                    ->get();

                $data[$criterion->id][$standard->id] = $scores;
            }
        }

        return response()->json(["finalGrades" => $grading, 'StandardScores' => $data]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * GET request +>
     *              /{pgpr}
     *
     */
    public function viewPreliminaryReport(ShowPreliminaryReportRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $reviewTeam = $pgpr->reviewTeam;

            $data = DB::table('final_reports')
                ->select('preliminary_report as preliminaryReport', 'type AS reportStatusType', 'created_at as createdAt', 'updated_at as updatedAt')
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
     * Get the validation rules that apply to the request.
     *
     * GET request +>
     *              /{pgpr}
     *
     */
    public function viewFinalReport(ShowFinalReportRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $pgpr = PostGraduateProgramReview::find($validated['pgpr_id']);
            $reviewTeam = $pgpr->reviewTeam;

            $data = DB::table('final_reports')
                ->select('final_report as finalReport', 'type AS reportStatusType', 'created_at as createdAt', 'updated_at as updatedAt')
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
