<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\ShowProperEvaluationDetailsOfReviewTeamRequest;
use App\Http\Requests\V1\StoreReviewTeamRequest;
use App\Http\Requests\V1\UpdateReviewTeamRequest;
use App\Http\Resources\V1\CriteriaResource;
use App\Http\Resources\V1\ReviewTeamCollection;
use App\Http\Resources\V1\ReviewTeamResource;
use App\Http\Resources\V1\UserResource;
use App\Mail\InformDeanOfReviewTeamAssignment;
use App\Mail\InformReviewerOfReviewAssignment;
use App\Models\Criteria;
use App\Models\Dean;
use App\Models\PostGraduateProgramReview;
use App\Models\QualityAssuranceStaff;
use App\Models\Reviewer;
use App\Models\ReviewTeam;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Events\TransactionBeginning;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
        // TODO: ADD FILTERING
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
        }catch(AuthorizationException $e){
            return response()->json(["message" => $e -> getMessage()], 403);
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
            $this -> authorize('create', ReviewTeam::class);

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
            $postGraduateProgramReviewApplication = $postGraduateReviewProgram->postGraduateProgramReviewApplications; // find the PGPR application of the PGPR
            $dean = $faculty->deans[0]->user; // find the dean of the faculty

            DB::beginTransaction();

            $reviewTeam = new ReviewTeam();
            $reviewTeam->quality_assurance_council_officer_id = $qac->id;
            $reviewTeam->pgpr_id = $postGraduateProgramReviewApplication->id;
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
                    $reviewer['reviewer_id'], [
                        'role' => $reviewer['position'],
                        'review_team_id' => $reviewTeam->id,
                        'reviewer_confirmation' => 'PENDING',
                        'declaration_letter' => NULL
                    ]
                );
                $user = User::find($reviewer['reviewer_id']);
                $user->position = $reviewer['position'];
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
        }catch(AuthorizationException $exception){
            return response()->json(["message" => $exception -> getMessage()], 403);
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
        // TODO: ADD FILTERING (IF NEEDED)
        try {
            $this->authorize('view', ReviewTeam::class);

            //find the review team
            $reviewTeam = ReviewTeam::findOrFail($id)->load('reviewers');
            return new ReviewTeamResource($reviewTeam);

        }catch(AuthorizationException $e){
            return response()->json(["message" => $e -> getMessage()], 403);

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
            $reviewTeam->reviewers()->detach(); // remove the reviewers first
            $reviewTeam->delete(); // delete the review team
            DB::commit();
            return response()->json(['message' => 'The requested review team was deleted from the database.', 'data' => new ReviewTeamResource($reviewTeam)]);
        }catch(AuthorizationException $e){
            return response()->json(["message" => $e -> getMessage()], 403);
        }  catch (ModelNotFoundException $exception) {
            DB::rollBack();
            return response()->json(["message" => "There is not such review team in our databases."], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Something bad happened!, We are working on it."], 500);
        }
    }

    /**
     * Reviewer views PE details of review team
     * {
     *     reviewTeamId: 12,
     *     pgprId: 1,
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
                ->groupBy('assigned_to_reviewer_id')
                ->get();

            if ($reviewerRecords->isEmpty()) {
                return response()->json(['message' => 'Seems the criteria have not been assigned yet.', 'data' => []]);
            }

            $data = [];

            foreach ($reviewerRecords as $reviewerId => $records) {
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
        catch (Exception $exception) {
            DB::rollBack();
            return response()->json(["message" => "Something bad happened!, We are working on it."], 500);
        }
    }
}
