<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\UpdateAcceptAppointmentRequest;
use App\Http\Requests\V1\StoreAcademicStaffRequest;
use App\Http\Requests\V1\UpdateRejectAppointmentRequest;
use App\Mail\RejectReviewerRole;
use App\Models\Reviewer;
use App\Http\Requests\V1\StoreReviewerRequest;
use App\Http\Requests\V1\UpdateReviewerRequest;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\V1\ReviewerImport;
use Illuminate\Validation\ValidationException as ValidationValidationException;
use Maatwebsite\Excel\Validators\ValidationException;

class ReviewerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    //import reviewers using excel file
    public function importReviewers()
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
    public function downloadDeclarationLetter()
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
    public function acceptAppointment(UpdateAcceptAppointmentRequest $request): Response
    {
        try {
            //get the file
            $file = $request->file('file');

            // find the reviewer
            $reviewer = Reviewer::findOrFail(Auth::user()->id);

            if (!$reviewer) {
                return response("User has invalid credentials.", 401);
            }

            $candidateID = Auth::id();

            //move the file and create the file name
            $fileName = Str::random(10) . "_" . $candidateID . "." . $file->getClientOriginalExtension();
            $path = $file->storeAs('reviewer_declaration_letters', $fileName,  'public');

            //add the file path to the reviewer declaration_letter_path as an url
            $reviewer->path_to_declaration = Storage::disk('public')->url($path);
            $reviewer->reviewer_status = 'accepted';
            $reviewer->save();

            return response("Your declaration letter was successfully submitted.", 200);
        } catch (Exception $exception) {
            return response("An internal server error occurred, file cannot be stored.", 500);
        }
    }

    /**
     * Reject appointment
     */
    public function rejectAppointment(UpdateRejectAppointmentRequest $request)
    {
        try {
            //get the reviewer
            $reviewer = Reviewer::findOrFail(Auth::user()->id);

            if (!$reviewer) {
                return response("User has invalid credentials.", 401);
            }

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

            return response("Your request was duly noted, thank you for responding.");
        } catch (Exception $exception) {
            return response("An internal server error occurred, user request cannot be full filled.", 500);
        }
    }

    /**
     * Use case 1.1
     * Browse assigned program reviews => with filtering
     */
    public function browsePGPRs()
    {
    }

    /**
     * Use case 1.2
     * View specific program review
     */
    public function viewSpecificPGPR()
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
        // incase the user wants to create a reviewer account
    }

    /**
     * Display the specified resource.
     */
    public function show(Reviewer $reviewer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewerRequest $request, Reviewer $reviewer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reviewer $reviewer)
    {
        //
    }
}
