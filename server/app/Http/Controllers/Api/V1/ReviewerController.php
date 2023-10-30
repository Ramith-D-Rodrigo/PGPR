<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\ReviewerSubmitDeskEvaluation;
use App\Http\Requests\V1\ReviewerSubmitProperEvaluation;
use App\Http\Requests\V1\ShowOwnDeskEvaluationCriteriaWiseRequest;
use App\Http\Requests\V1\ShowOwnProperEvaluationCriteriaWiseRequest;
use App\Http\Requests\V1\ShowRemarksOfSERRequest;
use App\Http\Requests\V1\StoreConductDeskEvaluationRequest;
use App\Http\Requests\V1\StoreConductProperEvaluationRequest;
use App\Http\Requests\V1\UpdateAcceptAppointmentRequest;
use App\Http\Requests\V1\UpdateAcceptPGPRRequest;
use App\Http\Requests\V1\UpdateRejectAppointmentRequest;
use App\Http\Requests\V1\UpdateRejectPGPRAssignmentRequest;
use App\Http\Requests\V1\UpdateRejectPGPRRequest;
use App\Http\Requests\V1\UpdateSERRemarksOfSectionsABDRequest;
use App\Http\Resources\V1\DeskEvaluationCollection;
use App\Http\Resources\V1\PostGraduateProgramReviewResource;
use App\Http\Resources\V1\ProperEvaluationCollection;
use App\Http\Resources\V1\ReviewerBrowsePGPRCollection;
use App\Http\Resources\V1\ReviewerCollection;
use App\Http\Resources\V1\ReviewerResource;
use App\Mail\InformReviewerOfPGPRRejection;
use App\Mail\InformToOfficialsOfPGPRRejection;
use App\Mail\RejectReviewerRole;
use App\Mail\ReviewerRejectReviewAssignment;
use App\Models\DeskEvaluation;
use App\Models\PostGraduateProgramReview;
use App\Models\ProperEvaluation;
use App\Models\Reviewer;
use App\Http\Requests\V1\StoreReviewerRequest;
use App\Http\Requests\V1\UpdateReviewerRequest;
use App\Http\Controllers\Controller;
use App\Models\SelfEvaluationReport;
use App\Models\User;
use App\Services\V1\StandardService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\V1\ReviewerImport;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException as ValidationValidationException;
use Maatwebsite\Excel\Validators\ValidationException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use function Laravel\Prompts\select;
use App\Http\Resources\V1\ReviewTeamResource;
use App\Http\Resources\V1\ReviewerBrowsePGPRResource;

class ReviewerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ReviewerCollection
    {
        //returns everything ->with('postGraduateReviewProgram.postGraduateProgram.faculty.university')
        return new ReviewerCollection(Reviewer::all()->loadMissing([
            'user',
            'workingFaculty',
            'reviewTeams'
        ]));
    }

    //import reviewers using excel file
    public function importReviewers(): JsonResponse
    {
        try {
            //authorize the action
            $this->authorize('create', Reviewer::class);

            Excel::import(new ReviewerImport, request()->file('file'));
            //$arr = Excel::toArray(new ReviewerImport, request()->file('file'));

            //0th index has the all the rows
            return response()->json([
                'message' => 'Reviewers imported successfully'
            ], 200);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (\Google\Service\Exception $e) { //google drive error
            return response()->json([
                'message' => 'Error occurred while importing reviewers',
                'error' => $e->getErrors(),
            ], 500);
        } catch (ValidationException $e) {
            $failures = $e->errors();
            return response()->json([
                'message' => 'Error occurred while importing reviewers',
                'errors' => $failures
            ], 422);
        } catch (ValidationValidationException $e) { //validation errors of the array of rows when validating
            return response()->json([
                'message' => 'Error occurred while importing reviewers',
                'error' => $e->errors(),
            ], 500);
        }
        catch(Exception $e){
            return response() -> json([
                'message' => $e -> getMessage() ?? 'Error occurred while importing reviewers',
                'error' => $e -> getTrace()
            ], 500);
        }
    }

    /**
     * Downloading the appointment declaration letter
     */
    public function downloadRoleAcceptanceDeclarationLetter(): BinaryFileResponse|JsonResponse
    {

        try {
            $this->authorize('downloadRoleAcceptanceDeclarationLetterAuthorize', Reviewer::class);

            $headers = [
                "Content-Type: application/octet-stream",
                "Content-Disposition: attachment; filename=\"Declaration.docx\""
            ];

            $path = "reviewer_role_declaration/Declaration.docx";

            return response()->download(Storage::disk('public')->path($path), 'Declaration.docx', $headers);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (Exception $exception) {
            return response()->json(["message" => "Your request was duly noted, thank you for responding."], 201);
        }
    }

    /**
     * Accept appointment
     */
    public function acceptAppointment(UpdateAcceptAppointmentRequest $request): Response|JsonResponse
    {
        try {
            $this->authorize('acceptRejectAppointmentAuthorize', Reviewer::class);

            // find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::user()->id);

            //reviewer can on submit one declaration per role acceptance
            if ($reviewer->reviewer_status != 'pending') {
                return response()->json(["message" => "Declarations can only be submitted only once."], 400);
            }

            //get the file
            $file = $request->file('file');

            if (!$file) {
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
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
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
            $this->authorize('acceptRejectAppointmentAuthorize', Reviewer::class);

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
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "User has invalid credentials."], 401);
        } catch (Exception $exception) {
            return response()->json(["message" => "An internal server error occurred, user request cannot be full filled."], 500);
        }
    }

    public function downloadReviewAppointmentDeclarationLetter(Request $request): BinaryFileResponse|JsonResponse
    {
        try {
            $this->authorize('downloadReviewAppointmentDeclarationLetterAuthorize', Reviewer::class);

            $headers = [
                "Content-Type: application/octet-stream",
                "Content-Disposition: attachment; filename=\"Declaration.docx\""
            ];

            $path = "reviewer_review_team_declaration/Declaration.docx";

            return response()->download(Storage::disk('public')->path($path), 'Declaration.docx', $headers);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (Exception $exception) {
            return response()->json(["message" => "An internal server error occurred, user request cannot be full filled."], 500);
        }
    }

    /**
     * Use case 1.1
     * View program reviews
     */
    public function browsePGPRs(): ReviewerBrowsePGPRCollection|JsonResponse
    {
        //get the review teams and get the PGPRs from them
        try {
            $this->authorize('browsePGPRsAuthorize', Reviewer::class);
            //find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //find the review teams
            $review_teams = $reviewer
                ->reviewTeams
                ->whereIn('status', ['PENDING', 'ACCEPTED']); //only get either pending or accepted review teams only

            if (!count($review_teams)) {
                return response()->json(["message" => "Currently you don't have any reviews", "data" => []]);
            }

            return new ReviewerBrowsePGPRCollection($review_teams);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (ModelNotFoundException $exception) {
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

            $this->authorize('acceptRejectPGPRAssignmentAuthorize', [Reviewer::class, $request]);
            //get the declaration.
            $file = $request->file('file');

            if (!$file) {
                return response()->json(["message" => "The signed declaration letter must be submitted."], 400);
            }

            //find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //get the review team based on he PGPR id
            $review_team = $reviewer->reviewTeams
                ->whereIn('status', ['PENDING', 'ACCEPTED'])
                ->where('pgpr_id', $request->pgpr_id)
                ->first(); //get the only review team

            //check whether the review team exists
            if (!$review_team) {
                return response()->json(["message" => "The review that you are trying to accept doesn't exist."], 400);
            }

            if ($review_team->pivot->reviewer_confirmation != 'PENDING') {
                return response()->json(["message" => "You have either accepted or rejected this review before."], 400);
            }

            //upload the declaration file
            $candidateID = Auth::id();

            //move the file and create the file name
            $fileName = Str::random(10) . "_" . $candidateID . "." . $file->getClientOriginalExtension();
            $path = $file->storeAs('reviewer_pgpr_assignment_declaration_letters', $fileName, 'public');

            //change the status to ACCEPTED in the reviewer_review_team table
            $review_team->pivot->reviewer_confirmation = 'ACCEPTED';
            $review_team->pivot->declaration_letter = Storage::disk('public')->url($path); //add the file url here
            $review_team->pivot->save(); //save the data to the pivot table

            // TODO: INFORM REVIEW TEAM CREATOR

            return response()->json(['message' => 'Your declaration was successfully uploaded.'], 201);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (ModelNotFoundException $exception) {
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
            $this->authorize('acceptRejectPGPRAssignmentAuthorize', [Reviewer::class, $request]);

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

                /* //add the reviewer when rejecting the review to the reviewer_reject_post_graduate_program_review table
                DB::table('reviewer_reject_post_graduate_program_review')->insert([
                    'pgpr_id' => $review_team->pgpr_id,
                    'reviewer_id' => $reviewer->id,
                    'comment' => $request->comment ?? "",
                ]); */

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
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
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
     *
     * send the PGPR ID as pgprId=10 in the GET request
     * @throws ValidationValidationException
     */
    public function viewSpecificPGPR(Request $request): JsonResponse
    {
        $validator = Validator::make(['pgprId' => $request->route('pgprId')], [
            'pgprId' => 'required|exists:post_graduate_program_reviews,id',
        ], [
            'pgprId.required' => 'We need the postgraduate review program id inorder to provide the necessary details',
            'pgprId.exists' => 'There is no such postgraduate review program in our database, please check and retry',
        ]);

        if ($validator->passes()) {
            try {
                $validated = $validator->validated();
                $reviewer = Reviewer::findOrFail(Auth::id());

                $reviewTeam = $reviewer->reviewTeams->where('pgpr_id', $validated['pgprId'])->first()->load(['postGraduateReviewProgram' => ['selfEvaluationReport']]);

                if (!$reviewTeam) {
                    return response()->json(['message' => 'Hmm, seems this reviewer is not a member of the review team of the given pgpr'], 403);
                }

                return response()->json(['message' => 'successful', 'data' => new ReviewerBrowsePGPRResource($reviewTeam)]);
            } catch (ModelNotFoundException $exception) {
                return response()->json(['message' => 'Hmm. we dont have such reviewer in our system, how did you get in?'], 403);
            } catch (Exception $exception) {
                return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
            }
        } else {
            return response()->json(['message' => 'Unsuccessful', 'errors' => $validator->errors()]);
        }
    }

    /**
     * Reviewer can view the remarks that were provided for the sections A,B, and D
     * for a given SER
     *
     * GET request +>
     *              serId=10
     *
     * @param ShowRemarksOfSERRequest $request
     * @return JsonResponse
     */
    public function viewRemarksOfSectionsABD(ShowRemarksOfSERRequest $request): JsonResponse
    {
        try {
            $serId = $request->validated('ser_id');
            $reviewerId = Auth::id();

            $remarks = DB::table('ser_section_reviewer_remarks')->select(['section', 'remark'])->where([
                'reviewer_id' => $reviewerId,
                'ser_id' => $serId,
            ])->get();

            $data = [];
            $ser = SelfEvaluationReport::findOrFail($serId);
            $data['serData'] = [
                'serId' => $ser->id,
                'sectionA' => $ser->section_a,
                'sectionB' => $ser->section_b,
                'sectionD' => $ser->section_d,
            ];

            $data['remarks'] = [];

            if ($remarks) {
                foreach ($remarks as $remark) {
                    $data['remarks'][] = $remark;
                }
            }

            return response()->json(['message' => 'Successful', 'data' => $data]);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'The self evaluation report you requested cannot be found please check and try again.'], 422);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Use case 1.2.1
     * Update remarks of Section A, B and D
     *
     * POST request +>
     *                {
     *                      serId: 10,
     *                      sections: [
     *                          {
     *                              section: "A",
     *                              remark: "Hello, handsome",
     *                          },
     *                          {
     *                              section: "B",
     *                              remark: "Hello, gorgeous",
     *                          },
     *                          {
     *                              section: "D",
     *                              remark: "Hello, love",
     *                          }
     *                      ]
     *                }
     *
     */
    public function updateRemarksOfSectionsABD(UpdateSERRemarksOfSectionsABDRequest $request): JsonResponse
    {
        try {
            $this->authorize('updateRemarksOfSectionsABDAuthorize', [Reviewer::class, $request]);

            $reviewerId = Auth::id();
            $serId = $request->validated('ser_id');
            $sections = $request->validated('sections');
            DB::beginTransaction();
            foreach ($sections as $section) {
                $attributes = [
                    'reviewer_id' => $reviewerId,
                    'ser_id' => $serId,
                    'section' => $section['section']
                ];

                $values = [
                    'remark' => $section['remark']
                ];
                DB::table('ser_section_reviewer_remarks')->updateOrInsert($attributes, $values);
            }
            DB::commit();
            return response()->json(['message' => 'Your remarks were successfully updated']);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => $exception -> getMessage()], 500);
        }
    }

    /**
     * Use case 1.3
     * Conduct desk evaluation
     *
     *      {
     *          pgprId: 10,
     *          criteriaId: 10,
     *          standardId: 10,
     *          observations: "This is marvelous",
     *          score: 0 <= x <= 3
     *      }
     *
     *
     */
    public function conductDeskEvaluation(StoreConductDeskEvaluationRequest $request): JsonResponse
    {
        try {
            $this -> authorize('conductDeskEvaluationAuthorize', [Reviewer::class, $request]);

            $validated = $request->validated();
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($validated['pgpr_id']);
            $deskEvaluation = $postGraduateReviewProgram->deskEvaluations;

            if ($deskEvaluation) {
                $attributes = [
                    'desk_evaluation_id' => $deskEvaluation->id,
                    'reviewer_id' => Auth::id(),
                    'standard_id' => $validated['standard_id'],
                ];

                $values = [
                    'de_score' => $validated['de_score'],
                    'comment' => $validated['comment'],
                ];

                DB::table('desk_evaluation_score')->updateOrInsert($attributes, $values);

                return response()->json(['message' => 'Successful, added the data']);
            } else {
                return response()->json(
                    ['message' => 'Desk evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);

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
     * Use case
     * Conduct proper evaluation
     *
     *      {
     *          pgprId: 10,
     *          criteriaId: 10,
     *          standardId: 10,
     *          comment: "This is marvelous",
     *          score: 0 <= x <= 3
     *      }
     *
     *
     */
    public function conductProperEvaluation(StoreConductProperEvaluationRequest $request): JsonResponse
    {
        try {
            $this -> authorize('conductProperEvaluationAuthorize', [Reviewer::class, $request]);

            $validated = $request->validated();
            $postGraduateReviewProgram = PostGraduateProgramReview::findOrFail($validated['pgpr_id']);
            $properEvaluation = $postGraduateReviewProgram->properEvaluation;

            if ($properEvaluation) {
                $attributes = [
                    'proper_evaluation_id' => $properEvaluation->id,
                    'reviewer_id' => Auth::id(),
                    'standard_id' => $validated['standard_id'],
                ];

                $values = [
                    'pe_score' => $validated['pe_score'],
                    'comment' => $validated['comment'],
                ];

                DB::table('proper_evaluation_score')->updateOrInsert($attributes, $values);

                return response()->json(['message' => 'Successful, added the data']);
            } else {
                return response()->json(
                    ['message' => 'Proper evaluation for this postgraduate program is not scheduled yet, will be informed when scheduled'],
                    422
                );
            }
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);

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
     * Use case 1.4
     * View own DE => criteria wise => criteria wise score
     * Send only the criteria of the reviewers => the number of pending
     * and marked standards for the criteria
     *
     * GET request +>
     *              deskEvaluation=12&criteria=10
     *                      or
     *              deskEvaluation=12
     */
    public function viewOwnDeskEvaluationCriteria(ShowOwnDeskEvaluationCriteriaWiseRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $deskEvaluation = DeskEvaluation::find($validated['desk_evaluation_id']);
            $pgp = $deskEvaluation->postGraduateProgramReview->postGraduateProgram;

            $data = [];

            if (array_key_exists('criteria_id', $validated)) {
                $evaluated_standards = DB::table('desk_evaluation_score')
                    ->join('standards', 'desk_evaluation_score.standard_id', '=', 'standards.id')
                    ->where([
                        'standards.criteria_id' => $validated['criteria_id'],
                        'desk_evaluation_score.desk_evaluation_id' => $validated['desk_evaluation_id'],
                        'desk_evaluation_score.reviewer_id' => Auth::id()
                    ])
                    ->count();

                $criteria_name = DB::table('criterias')->where('id', $validated['criteria_id'])->value('name');

                // Count total number of standards for this criteria
                $total_standards = count(StandardService::getApplicableStandards(
                    $pgp->slqf_level,
                    $pgp->is_professional_pg_programme,
                    $validated['criteria_id']
                ));

                $data[] = [
                    'criteriaName' => $criteria_name,
                    'totalStandards' => $total_standards,
                    'evaluatedStandards' => $evaluated_standards,
                ];
            } else {
                $criteria_ids = DB::table('criterias')->pluck('id');

                foreach ($criteria_ids as $criteria_id) {
                    // Get criteria name
                    $criteria_name = DB::table('criterias')->where('id', $criteria_id)->value('name');

                    // Count total number of standards for this criteria
                    $total_standards = count(StandardService::getApplicableStandards(
                        $pgp->slqf_level,
                        $pgp->is_professional_pg_programme,
                        $criteria_id
                    ));

                    $evaluated_standards = [];
                    // Count number of evaluated standards for this criteria

                    $evaluated_standards = DB::table('desk_evaluation_score')
                        ->join('standards', 'desk_evaluation_score.standard_id', '=', 'standards.id')
                        ->where([
                            'standards.criteria_id' => $criteria_id,
                            'desk_evaluation_score.desk_evaluation_id' => $validated['desk_evaluation_id'],
                            'desk_evaluation_score.reviewer_id' => Auth::id()
                        ])
                        ->count();

                    // Store in data
                    $data[] = [
                        'criteriaId' => $criteria_id,
                        'criteriaName' => $criteria_name,
                        'totalStandards' => $total_standards,
                        'evaluatedStandards' => $evaluated_standards,
                    ];
                }
            }
            return response()->json(['message' => 'Success', 'data' => $data]);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     *  GET request +>
     *               pgpr=8&properEvaluation=12&criteria=10
     *                                or
     *               pgpr=8&properEvaluation=12
     */
    public function viewOwnProperEvaluationCriteria(ShowOwnProperEvaluationCriteriaWiseRequest $request): JsonResponse
    {
        try {

            $validated = $request->validated();

            $properEvaluation = ProperEvaluation::find($validated['proper_evaluation_id']);
            $pgp = $properEvaluation->postGraduateProgramReview->postGraduateProgram;

            $data = [];

            if (array_key_exists('criteria_id', $validated)) {

                // Count number of evaluated standards for this criteria
                $evaluated_standards = DB::table('proper_evaluation_score')
                    ->join('standards', 'proper_evaluation_score.standard_id', '=', 'standards.id')
                    ->where([
                        'standards.criteria_id' => $validated['criteria_id'],
                        'proper_evaluation_score.proper_evaluation_id' => $validated['proper_evaluation_id'],
                        'proper_evaluation_score.reviewer_id' => Auth::id()
                    ])
                    ->count();

                $criteria_name = DB::table('criterias')->where('id', $validated['criteria_id'])->value('name');

                // Count total number of standards for this criteria
                $total_standards = count(StandardService::getApplicableStandards(
                    $pgp->slqf_level,
                    $pgp->is_professional_pg_programme,
                    $validated['criteria_id']
                ));

                $data[] = [
                    'criteriaId' => $validated['criteria_id'],
                    'criteriaName' => $criteria_name,
                    'totalStandards' => $total_standards,
                    'evaluatedStandards' => $evaluated_standards,
                ];
            } else {
                $criteria_ids = DB::table('reviewer_team_set_criteria')
                    ->where([
                        'assigned_to_reviewer_id' => Auth::id(),
                        'pgpr_id' => $validated['pgpr_id'],
                    ])
                    ->pluck('criteria_id');

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
                            'proper_evaluation_score.reviewer_id' => Auth::id()
                        ])
                        ->count();

                    // Store in data
                    $data[] = [
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

    /**
     * reviewer submit desk evaluation
     * POST request +>
     *              {
     *                  deskEvaluation=10
     *              }
     */
    public function submitDeskEvaluation(ReviewerSubmitDeskEvaluation $request): JsonResponse
    {
        try {
            $this -> authorize('submitDeskEvaluationAuthorize', [Reviewer::class, $request]);

            $validated = $request->validated();

            // Get all criteria ids
            $criteria_ids = DB::table('criterias')->pluck('id');

            $deskEvaluation = DeskEvaluation::find($validated['desk_evaluation_id']);
            $pgp = $deskEvaluation->postGraduateProgramReview->postGraduateProgram;

            $data = [];

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
                $evaluated_standards = DB::table('desk_evaluation_scores')
                    ->join('standards', 'desk_evaluation_scores.standard_id', '=', 'standards.id')
                    ->where([
                        'standards.criteria_id' => $criteria_id,
                        'desk_evaluation_scores.desk_evaluation_id' => $validated['desk_evaluation_id'],
                        'desk_evaluation_scores.reviewer_id' => Auth::id()
                    ])
                    ->count();

                // Calculate number of standards left to be evaluated
                $standards_left = $total_standards - $evaluated_standards;

                // Store in array
                $data[] = [
                    'criteriaId' => $criteria_id,
                    'criteriaName' => $criteria_name,
                    'totalStandards' => $total_standards,
                    'evaluatedStandards' => $evaluated_standards,
                    'standardsLeft' => $standards_left,
                ];
            }

            // Check if all standards have been evaluated
            $all_evaluated = true;
            foreach ($data as $item) {
                if ($item['standardsLeft'] > 0) {
                    $all_evaluated = false;
                    break;
                }
            }

            // if +> All standards have been evaluated, reviewer can submit desk evaluation
            // else +> Not all standards have been evaluated, inform reviewer about pending standards
            if ($all_evaluated) {
                // Get the post graduate program review and the review team
                $faculty = $pgp->faculty;
                $university = $faculty->university;
                $reviewTeam = $pgp->reviewTeam;
                $reviewers = $reviewTeam->reviewers;

                $reviewChair = User::find($reviewers->first(function ($reviewer) {
                    return $reviewer->pivot->role == 'CHAIR';
                })->id);

                $reviewer = User::find(Auth::id());

                // Send the mail
                Mail::to($reviewChair->official_email)->send(
                    new \App\Mail\ReviewerSubmitDeskEvaluation(
                        reviewer: $reviewer,
                        reviewChair: $reviewChair,
                        subject: 'Reviewer Completed Desk Evaluation',
                        content: 'mail.reviewerSubmitDeskEvaluation'
                    )
                );
                return response()->json(['message' => 'You have successful submitted the desk review']);
            } else {
                return response()->json([
                    'message' => 'You have standards that you have not evaluated in this desk evaluation yet, please complete them before submitting them',
                    'data' => $data
                ]);
            }
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * reviewer submit proper evaluation
     * POST request +>
     *              {
     *                  pgpr: 12,
     *                  properEvaluation: 10
     *              }
     */
    public function submitProperEvaluation(ReviewerSubmitProperEvaluation $request): JsonResponse
    {
        try {
            $this -> authorize('submitProperEvaluationAuthorize', [Reviewer::class, $request]);

            $validated = $request->validated();

            // Get all criteria ids assigned to the reviewer
            $criteria_ids = DB::table('reviewer_team_set_criteria')
                ->where([
                    'assigned_to_reviewer_id' => Auth::id(),
                    'pgpr_id' => $validated['pgpr_id'],
                ])
                ->pluck('criteria_id');

            $properEvaluation = ProperEvaluation::find($validated['proper_evaluation_id']);
            $postGraduateProgramReview = $properEvaluation->postGraduateProgramReview;
            $pgp = $postGraduateProgramReview->postGraduateProgram;

            $data = [];

            $all_evaluated = true;

            foreach ($criteria_ids as $criteria_id) {
                // Get criteria name
                $criteria_name = DB::table('criterias')->where('id', $criteria_id)->value('name');

                // Count total number of standards for this criteria
                $standard_ids = array_map(
                    function ($standard) {
                        return $standard->id;
                    },
                    StandardService::getApplicableStandards(
                        $pgp->slqf_level,
                        $pgp->is_professional_pg_programme,
                        $criteria_id
                    )
                );

                $standards_data = [];

                foreach ($standard_ids as $standard_id) {
                    // Check if this standard has been evaluated
                    $is_evaluated = DB::table('proper_evaluation_score')
                        ->where([
                            'standard_id' => $standard_id,
                            'proper_evaluation_id' => $validated['proper_evaluation_id'],
                            'reviewer_id' => Auth::id()
                        ])
                        ->exists();

                    if (!$is_evaluated) {
                        // If not evaluated, get standard description
                        $standard_description = DB::table('standards')->where('id', $standard_id)->value('description');
                        $standard_no = DB::table('standards')->where('id', $standard_id)->value('standard_no');
                        $standards_data[] = [
                            'standardId' => $standard_id,
                            'standardNo' => $standard_no,
                            'standardDescription' => $standard_description,
                        ];
                        // Set all evaluated to false
                        $all_evaluated = false;
                    }
                }

                $data[] = [
                    'criteriaId' => $criteria_id,
                    'criteriaName' => $criteria_name,
                    'pendingStandards' => $standards_data,
                ];
            }

            if ($all_evaluated) {
                // All standards have been evaluated, reviewer can submit proper evaluation
                // Get the post graduate program review and the review team
                $faculty = $pgp->faculty;
                $university = $faculty->university;
                $reviewTeam = $postGraduateProgramReview->reviewTeam;
                $reviewers = $reviewTeam->reviewers;

                $reviewChair = User::find($reviewers->first(function ($reviewer) {
                    return $reviewer->pivot->role == 'CHAIR';
                })->id);

                $reviewer = User::find(Auth::id());

                // Send the mail
                Mail::to($reviewChair->official_email)->send(
                    new \App\Mail\ReviewerSubmitProperEvaluation(
                        reviewer: $reviewer,
                        reviewChair: $reviewChair,
                        subject: 'Reviewer Completed Proper Evaluation',
                        content: 'mail.reviewerSubmitProperEvaluation'
                    )
                );
                return response()->json(['message' => 'Successfully submitted the proper evaluation']);
            } else {
                // Not all standards have been evaluated, inform reviewer about pending standards
                return response()->json(['message' => 'You cannot submit the proper evaluation yet, have some incomplete evaluations', 'data' => $data]);
            }
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);

        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewerRequest $request)
    {
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
    public function show(string $id): ReviewerResource|JsonResponse
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
     * Get desk evaluations of the currently logged in reviewer
     */
    public function reviewerDeskEvaluations(): JsonResponse|DeskEvaluationCollection
    {
        try {
            // find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //find the review teams of the reviewer
            $reviewTeams = $reviewer
                ->reviewTeams
                ->whereIn('status', ['PENDING', 'APPROVED'])
                ->load('postGraduateReviewProgram'); //only get either pending or accepted review teams only

            $deskEvaluations = collect();

            foreach ($reviewTeams as $reviewTeam) {
                $postGraduateReviewProgram = $reviewTeam->postGraduateReviewProgram;
                $deskEvaluation = $postGraduateReviewProgram->deskEvaluations;
                if ($deskEvaluation) $deskEvaluations->add($deskEvaluation);
            }

            return count($deskEvaluations) > 0 ?
                new DeskEvaluationCollection($deskEvaluations) :
                response()->json(["message" => "The reviewer doesn't have any desk evaluations yet"]);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "The requested reviewer data cannot be found"], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Some thing bad happened"], 500);
        }
    }

    /**
     * Get desk evaluations of the currently logged in reviewer
     */
    public function reviewerProperEvaluations(): ProperEvaluationCollection|JsonResponse
    {
        try {
            // find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::id());

            //find the review teams of the reviewer
            $reviewTeams = $reviewer
                ->reviewTeams
                ->whereIn('status', ['PENDING', 'APPROVED'])
                ->load('postGraduateReviewProgram'); //only get either pending or accepted review teams only

            $properEvaluations = collect();

            foreach ($reviewTeams as $reviewTeam) {
                $postGraduateReviewProgram = $reviewTeam->postGraduateReviewProgram;
                $properEvaluation = $postGraduateReviewProgram->properEvaluations;
                if ($properEvaluation) $properEvaluations->add($properEvaluation);
            }

            return count($properEvaluations) > 0 ?
                new ProperEvaluationCollection($properEvaluations) :
                response()->json(["message" => "The reviewer doesn't have any proper evaluations yet"]);
        } catch (ModelNotFoundException $exception) {
            return response()->json(["message" => "The requested reviewer data cannot be found"], 400);
        } catch (Exception $exception) {
            return response()->json(["message" => "Some thing bad happened"], 500);
        }
    }

    /**
     * Reviewer reject PGPR in desk evaluation if the evidences aren't up to expected standard
     */
    public function rejectPGPRInEvaluation(UpdateRejectPGPRRequest $request): JsonResponse
    {
        try {
            $this -> authorize('rejectPGPRInEvaluationAuthorize', [Reviewer::class, $request]);

            $validated = $request->validated();

            DB::beginTransaction();

            DB::table('reviewer_reject_post_graduate_program_review')->insert([
                'reviewer_id' => Auth::id(),
                'pgpr_id' => $validated['pgpr_id'],
                'comment' => $validated["comment"] ?? "",
            ]);

            // check whether all the members have submitted rejections
            $rejections = DB::table('reviewer_reject_post_graduate_program_review')
                ->select('pgpr_id', 'reviewer_id', 'comment')
                ->where([
                    'pgpr_id' => $validated['pgpr_id'],
                ])
                ->get();

            $postGraduateProgramReview = PostGraduateProgramReview::find($validated['pgpr_id']);
            $postGraduateProgram = $postGraduateProgramReview->postGraduateProgram;

            if ($rejections->count() >= 3) {
                $qacDirector = User::find($postGraduateProgramReview->qac_dir_id);
                $programCoodinator = User::find($postGraduateProgram->currentProgrammeCoordinator->id);
                $dean = User::find($postGraduateProgram->faculty->currentDean->id);

                $data = [];
                $data['postGraduateProgram'] = $postGraduateProgram;
                $data['reviewers'] = [];
                foreach ($rejections as $rejection) {
                    $data['reviewers'][] = [
                        'reviewer' => User::find($rejection['reviewer_id']),
                        'comment' => $rejection['comment'],
                    ];
                }

                //sending the mail to the dean
                Mail::to($dean->official_email)
                    ->send(new InformToOfficialsOfPGPRRejection(
                        recipient: $dean,
                        data: $data,
                        subject: 'Review team rejected the post graduate program review',
                        content: 'mail.informToOfficialsAboutReviewTeamPGPRRejection',
                    ));
                //sending the mail to the program coordinator
                Mail::to($programCoodinator->official_email)
                    ->send(new InformToOfficialsOfPGPRRejection(
                        recipient: $programCoodinator,
                        data: $data,
                        subject: 'Review team rejected the post graduate program review',
                        content: 'mail.informToOfficialsAboutReviewTeamPGPRRejection',
                    ));
                //sending the mail to the qac director
                Mail::to($qacDirector->official_email)
                    ->send(new InformToOfficialsOfPGPRRejection(
                        recipient: $qacDirector,
                        data: $data,
                        subject: 'Review team rejected the post graduate program review',
                        content: 'mail.informToOfficialsAboutReviewTeamPGPRRejection',
                    ));

                // TODO: send the mail to the IQAU DIR

                //set the pgpr status as rejected/suspended
                $postGraduateProgramReview->status_of_pgpr = 'SUSPENDED';
                $postGraduateProgramReview->save();
            }
            // inform the other reviewers
            $reviewers = $postGraduateProgramReview->reviewTeam->reviewers; // get the review team
            $rejectedReviewer = Auth::user();
            foreach ($reviewers as $reviewer) {
                if ($reviewer->id != Auth::id()) {
                    $user = User::find($reviewer->id);
                    Mail::to($user->official_email)
                        ->send(
                            new InformReviewerOfPGPRRejection(
                                recipient: $user,
                                rejectedBy: $rejectedReviewer,
                                content: 'mail.reviewerRejectedPGPRInEvaluation',
                                subject: 'Reviewer rejected the post graduate program',
                                comment: $validated['comment'],
                                postGraduateProgram: $postGraduateProgram,
                            )
                        );
                }
            }
            DB::commit();
            return response()->json(['message' => 'Your request is duly noted, thank you for responding.']);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
        }
    }

    /**
     * review view comments and scores provided for the assigned proper evaluation criteria
     *
     *  GET request +>
     *               pgpr=8&properEvaluation=12
     */
    public function viewOwnProperEvaluationCommentsAndScores(ShowOwnProperEvaluationCriteriaWiseRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $properEvaluation = ProperEvaluation::find($validated['proper_evaluation_id']);
            $pgp = $properEvaluation->postGraduateProgramReview->postGraduateProgram;

            $records = [];

            $criteria_ids = DB::table('reviewer_team_set_criteria')
                ->where([
                    'assigned_to_reviewer_id' => Auth::id(),
                    'pgpr_id' => $validated['pgpr_id'],
                ])
                ->pluck('criteria_id');

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
                        'proper_evaluation_score.reviewer_id' => Auth::id()
                    ])
                    ->select(
                        'proper_evaluation_scores.proper_evaluation_id AS properEvaluationId',
                        'proper_evaluation_scores.reviewer_id AS reviewerId',
                        'proper_evaluation_scores.standard_id AS standardId',
                        'proper_evaluation_scores.pe_score AS peScore',
                        'proper_evaluation_scores.comment'
                    )
                    ->get();

                // Store in data
                $records[] = [
                    'criteriaId' => $criteria_id,
                    'criteriaName' => $criteria_name,
                    'totalStandards' => $total_standards,
                    'evaluatedStandards' => $evaluated_standards,
                ];
            }
            return response()->json($records);
        } catch (Exception $exception) {
            return response()->json(['message' => 'We have encountered an error, try again in a few moments please'], 500);
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

    public function downloadExcelFile(): StreamedResponse|JsonResponse
    {
        try {
            return Storage::download('public/reviewer-excel-template.xlsx');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error occurred while downloading reviewer sheet',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
