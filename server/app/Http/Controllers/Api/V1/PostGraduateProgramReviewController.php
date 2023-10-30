<?php

namespace App\Http\Controllers\Api\V1;

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
use Illuminate\Auth\Access\AuthorizationException;
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
            $reviewTeam->dean_id = $faculty -> dean ->id;
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
            Mail::to($faculty -> dean -> academicStaff -> universitySide -> user ->official_email)
                ->send(
                    new InformDeanOfReviewTeamAssignment(
                        $faculty -> dean,
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
}
