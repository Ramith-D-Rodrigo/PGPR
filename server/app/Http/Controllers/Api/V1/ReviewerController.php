<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\UpdateAcceptAppointmentRequest;
use App\Http\Requests\V1\StoreAcademicStaffRequest;
use App\Http\Requests\V1\UpdateAcceptPGPRRequest;
use App\Http\Requests\V1\UpdateRejectAppointmentRequest;
use App\Http\Requests\V1\UpdateRejectPGPRAssignmentRequest;
use App\Http\Resources\V1\ReviewerBrowsePGPRCollection;
use App\Http\Resources\V1\ReviewerBrowsePGPRResource;
use App\Http\Resources\V1\ReviewerCollection;
use App\Http\Resources\V1\ReviewerResource;
use App\Mail\RejectReviewerRole;
use App\Mail\ReviewerRejectReviewAssignment;
use App\Models\Reviewer;
use App\Http\Requests\V1\StoreReviewerRequest;
use App\Http\Requests\V1\UpdateReviewerRequest;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\V1\ReviewerImport;
use Illuminate\Validation\ValidationException as ValidationValidationException;
use Maatwebsite\Excel\Validators\ValidationException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReviewerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ReviewerCollection
    {
        //returns everything
        return new ReviewerCollection(Reviewer::all()->loadMissing(['user', 'workingFaculty', 'reviewTeams']));
    }

    //import reviewers using excel file
    public function importReviewers(): JsonResponse
    {
        try {
            Excel::import(new ReviewerImport, request()->file('file'));
            //$arr = Excel::toArray(new ReviewerImport, request()->file('file'));

            //0th index has the all the rows
            return response()->json([
                'message' => 'Reviewers imported successfully'
            ], 200);
        } catch (\Google\Service\Exception $e) { //google drive error
            return response()->json([
                'message' => 'Error occurred while importing reviewers',
                'error' => $e->getErrors(),
            ], 500);
        } catch (ValidationException $e) {
            $failures = $e->errors();
            return response()->json([
                'errors' => $failures
            ], 422);
        } catch (ValidationValidationException $e) { //validation errors of the array of rows when validating
            return response()->json([
                'message' => 'Error occurred while importing reviewers',
                'error' => $e->errors(),
            ], 500);
        }
    }

    /**
     * Downloading the appointment declaration letter
     */
    public function downloadRoleAcceptanceDeclarationLetter(): BinaryFileResponse
    {
        $headers = [
            "Content-Type: application/octet-stream",
            "Content-Disposition: attachment; filename=\"Declaration.docx\""
        ];

        $path = "reviewer_role_declaration/Declaration.docx";

        return response()->download(Storage::disk('public')->path($path), 'Declaration.dox', $headers);
    }

    /**
     * Accept appointment
     */
    public function acceptAppointment(UpdateAcceptAppointmentRequest $request): Response|JsonResponse
    {
        try {
            // find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::user()->id);

            //reviewer can on submit one declaration per role acceptance
            if ($reviewer->status != 'pending') {
                return response()->json(["message" => "Declarations can only be submitted only once."], 400);
            }

            //get the file
            $file = $request->file('file');

            if ($file) {
                return response("The submission must have a pdf that contains the signed declaration.", 400);
            }

            $candidateID = Auth::id();

            //move the file and create the file name
            $fileName = Str::random(10) . "_" . $candidateID . "." . $file->getClientOriginalExtension();
            $path = $file->storeAs('reviewer_declaration_letters', $fileName, 'public');

            //add the file path to the reviewer declaration_letter_path as an url
            $reviewer->path_to_declaration = Storage::disk('public')->url($path);
            $reviewer->reviewer_status = 'accepted';
            $reviewer->save();

            return response()->json(["message" => "Your declaration letter was successfully submitted."], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "The requested reviewer data cannot be found"], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Your request was duly noted, thank you for responding."], 201);
        }
    }

    /**
     * Reject appointment
     */
    public function rejectAppointment(UpdateRejectAppointmentRequest $request): JsonResponse
    {
        try {
            //get the reviewer
            $reviewer = Reviewer::findOrFail(Auth::user()->id);

            //get user who created the reviewer account
            $createdUser = User::findOrFail(Auth::user()->created_by);
            if (!$createdUser) {
                throw new Exception("This shouldn't happen when creating users");
            }

            //mail the remark if exists the remark
            Mail::to($createdUser->official_email)
                ->send(
                    new RejectReviewerRole(
                        $createdUser,
                        Auth::user(),
                        $request->validated('remark') ?? NULL,
                        'User Rejected an Appointment for a Reviewer Role',
                        'mail.userRejectedReviewerRole'
                    )
                );

            //remove access privileges from user
            $reviewer->reviewer_status = 'rejected';

            //should the reviewer role be removed?

            $reviewer->save();

            return response()->json(["message" => "Your request was duly noted, thank you for responding."], 201);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "User has invalid credentials."], 401);
        } catch (Exception $exception) {
            return response()->json(["message" => "An internal server error occurred, user request cannot be full filled."], 500);
        }
    }

    //TODO: NEED TO CHECK WHETHER THE USER IS ACTUALLY PART OF THE REVIEW TEAM
    public function downloadReviewAppointmentDeclarationLetter(Request $request): BinaryFileResponse
    {
        $headers = [
            "Content-Type: application/octet-stream",
            "Content-Disposition: attachment; filename=\"Declaration.docx\""
        ];

        $path = "reviewer_review_team_declaration/Declaration.docx";

        return response()->download(Storage::disk('public')->path($path), 'Declaration.dox', $headers);
    }

    /**
     * Use case 1.1
     * View program reviews => with filtering
     * TODO: IMPLEMENT FILTERING
     */
    public function browsePGPRs(Request $request): ReviewerBrowsePGPRCollection|JsonResponse
    {
        //get the review teams and get the PGPRs from them
        try {
            //find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //find the review teams
            $review_teams = $reviewer
                ->reviewTeams
                ->whereIn('status', ['PENDING', 'APPROVED']); //only get either pending or accepted review teams only

            if (!count($review_teams)) {
                return response()->json(["message" => "Currently you don't have any reviews", "data" => []]);
            }

            return new ReviewerBrowsePGPRCollection($review_teams);
        }catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "Your credentials are wrong, cannot be authorized for this action.", "data" => []], 401);
        } catch (Exception $exception) {
            return response()->json(["message" => "An internal server error occurred, user request cannot be full filled."], 500);
        }
    }

    /**
     * Accept PGPR assignment
     * Sends the pgprID and the file
     */
    public function acceptPGPRAssignment(UpdateAcceptPGPRRequest $request): Response|JsonResponse
    {
        try {
            //get the declaration.
            $file = $request->file('file');

            /* echo json_encode($file);
             exit;*/

            if (!$file) {
                return response()->json(["message" => "The signed declaration letter must be submitted."], 400);
            }

            //find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //get the review team based on he PGPR id
            $review_team = $reviewer->reviewTeams
                ->whereIn('status', ['PENDING', 'APPROVED'])
                ->where('pgpr_id', $request->pgpr_id)
                ->first(); //get the only review team

            //check whether the review team exists
            if (!$review_team) {
                return response()->json(["message" => "The review that you are trying to accept doesn't exist."], 400);
            }

            if ($review_team->pivot->reviewer_Confirmation != 'PENDING') {
                return response()->json(["message" => "You have either accepted or rejected this review before."], 400);
            }

            //upload the declaration file
            $candidateID = Auth::id();

            //move the file and create the file name
            $fileName = Str::random(10) . "_" . $candidateID . "." . $file->getClientOriginalExtension();
            $path = $file->storeAs('reviewer_pgpr_assignment_declaration_letters', $fileName, 'public');

            //change the status to ACCEPTED in the reviewer_review_team table
            $review_team->pivot->reviewer_confirmation = 'ACCEPTED';
            $review_team->pivot->declaration_letter = Storage::disk('public')->url($path);//add the file url here
            $review_team->pivot->save(); //save the data to the pivot table

            return response()->json(['message' => 'Your declaration was successfully uploaded.'], 201);
        }catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "Your credentials are wrong, cannot be authorized for this action.", "data" => []], 401);
        } catch (Exception $exception) {
            return response()->json(["message" => "An internal server error occurred, user request cannot be full filled."], 500);
        }
    }


    /**
     * Reject PGPR assignment
     */
    public function rejectPGPRAssignment(UpdateRejectPGPRAssignmentRequest $request): JsonResponse
    {
        try {
            //find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //get the review team based on he PGPR id
            $review_team = $reviewer->reviewTeams
                ->whereIn('status', ['PENDING', 'APPROVED'])
                ->where('pgpr_id', $request->pgpr_id)
                ->first(); //get the only review team

            $post_grad_program = $review_team->postGraduateReviewProgram->postGraduateProgram;

            $creatorOfReviewTeam = User::find($review_team->quality_assurance_council_officer_id)->get();

            if (!$creatorOfReviewTeam) {
                throw new Exception("There is something wrong with this entry please check"); // needs better error logging
            }

            //check whether the review team exists
            if (!$review_team) {
                return response()->json(["message" => "The review that you are trying to reject doesn't exist."], 400);
            }

            if ($review_team->pivot->reviewer_Confirmation == 'PENDING') {
                //set the state to reject
                DB::beginTransaction();
                $review_team->pivot->reviewer_confirmation = 'REJECTED';
                $review_team->pivot->save();

                //add the reviewer when rejecting the review to the reviewer_reject_post_graduate_program_review table
                DB::table('reviewer_reject_post_graduate_program_review')->insert([
                    'pgpr_id' => $review_team->pgpr_id,
                    'reviewer_id' => $reviewer->id,
                    'comment' => $request->comment ?? "",
                ]);

                Mail::to($creatorOfReviewTeam->official_email)
                    ->send(
                        new ReviewerRejectReviewAssignment(
                            $creatorOfReviewTeam,
                            $reviewer,
                            $post_grad_program,
                            $request->validated('comment'),
                            'Reviewer Rejected Postgraduate Program Review',
                            'mail.reviewerRejectedReviewAssignment'
                        )
                    );

                DB::commit();
                return response()->json(["message" => "Your request was duly noted, thank you for responding."], 201);
            } else {
                return response()->json(["message" => "You have already made your decision about this review cannot change it now."], 400);
            }
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "Your credentials are wrong, cannot be authorized for this action.", "data" => []], 401);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(["message" => "An internal server error occurred, user request cannot be full filled."], 500);
        }
    }


    /**
     * Use case 1.2
     * View specific program review
     */
    public function viewSpecificPGPR(Request $request)
    {
    }

    /**
     * Use case 1.2.1
     * Update remarks of Section A, B and D
     */
    public function updateRemarksOfSection()
    {
    }

    /**
     * Use case 1.3
     * Conduct desk evaluation
     */
    public function conductDeskEvaluation()
    {
    }

    /**
     * Use case 1.4
     * View own DE => criteria wise
     */
    public function viewOwnDECriteria()
    {
    }

    /**
     * Use case 1.6
     * View summary of DE grade
     */
    public function viewSummaryOfDEGrade()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewerRequest $request)
    {
        //incase the user wants to create a reviewer account,
        //add the reviewer role to the user,
        //add the user to the reviewer table
        //return the response to the user
    }

    /**
     * You can get the current reviewer profile data using this method
     */
    public function displayReviewerProfile(): ReviewerResource|JsonResponse
    {
        return $this->show(Auth::id());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //get the necessary data from the user table and return that
        try {
            $reviewer = Reviewer::with(['user', 'workingFaculty', 'reviewTeams'])->findOrFail($id); //get the reviewer
            //to use the resource to send the data
            return new ReviewerResource($reviewer);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "The requested reviewer data cannot be found"], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Some thing bad happened"], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewerRequest $request, Reviewer $reviewer)
    {
        //update the given fields of the reviewer in the review table
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reviewer $reviewer)
    {
        //remove the user's reviewer role
    }
}
