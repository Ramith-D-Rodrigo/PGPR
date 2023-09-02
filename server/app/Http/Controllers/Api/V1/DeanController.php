<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\DeanAcceptReviewTeamRequest;
use App\Http\Requests\V1\DeanRejectReviewTeamRequest;
use App\Http\Resources\V1\DeanResource;
use App\Mail\InformReviewTeamAcceptanceToQAC;
use App\Mail\InformReviewTeamRejectionToQAC;
use App\Mail\RejectReviewerRole;
use App\Models\Dean;
use App\Http\Requests\V1\StoreDeanRequest;
use App\Http\Requests\V1\UpdateDeanRequest;
use App\Http\Controllers\Controller;
use App\Mail\sendPassword;
use App\Models\Faculty;
use App\Models\ReviewTeam;
use App\Services\V1\DeanService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class DeanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeanRequest $request)
    {
        //set needed additional fields

        $validatedData = $request->validated(); //get the validated data

        $validatedData['status'] = 'Pending'; //set the status (user account status)
        $validatedData['current_status'] = 'Active';   //set the current status (dean status)
        $validatedData['roles'] = ['dean']; //set the roles (dean role)


        $password = Str::random(8);  //generate a random password
        //hash the password using Hash facade

        $validatedData['password'] = Hash::make($password); //set the password

        try {
            DB::beginTransaction();

            //store the files
            $validatedData = DeanService::storeFiles($validatedData);

            $dean = DeanService::create($validatedData);

            //update the faculty dean id
            $faculty = Faculty::findOrFail($validatedData['faculty_id']);

            $faculty->update([
                'dean_id' => $dean->id
            ]);

            //send the email
            DeanService::sendAccountCreateMail($validatedData, $password);
            DB::commit();   //commit the changes if all of them were successful
            return new DeanResource($dean);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create dean', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeanRequest $request, Dean $dean)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Dean $dean)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dean $dean)
    {
        //
    }

    /**
     * Dean accepts review teams assign for PGPRs
     */
    public function acceptReviewTeam(DeanAcceptReviewTeamRequest $request): JsonResponse
    {
        try {

            $reviewTeam = ReviewTeam::findOrFail($request->id)->load(['reviewers']);

            if ($reviewTeam->status != "PENDING") {
                return response()->json(['message' => 'You cannot accept a previously accept or rejected review team'], 422);
            }

            $creatorOfReviewTeam = $reviewTeam->qualityAssuranceCouncilOfficer;
            $creatorOfReviewTeam = $creatorOfReviewTeam->user;

            $postGraduateProgram = $reviewTeam->postGraduateReviewProgram;
            $postGraduateProgram = $postGraduateProgram->postGraduateProgram;

            $faculty =  $postGraduateProgram->faculty;

            $dean =  $faculty->deans[0];
            $dean =  $dean->user;

            $university =  $faculty->university;

            // DB::beginTransaction();
            $reviewTeam->status = 'ACCEPTED';
            $reviewTeam->dean_decision = $request->dean_decision;
            $reviewTeam->remarks = $request->remark ?? 'N/A';

            // send the mail to the qac officer saying that the review team was accepted
            Mail::to($creatorOfReviewTeam->official_email)->send(
                new InformReviewTeamAcceptanceToQAC(
                    $creatorOfReviewTeam,
                    $reviewTeam,
                    $dean,
                    $postGraduateProgram,
                    $faculty,
                    $university,
                    "Dean of $faculty->name in $university->name has accepted the appointed review team",
                    "mail.informReviewTeamAcceptanceToQAC"
                )
            );
            $reviewTeam->save();
            DB::commit();
            return response()->json(['message' => 'Your request is duly noted.']);
        } catch (ModelNotFoundException $exception) {
            DB::rollBack();
            return response()->json(
                ['message' => 'Sorry we cannot find the review team that you requested in our database, please check and try again'],
                422
            );
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'Something bad has happened, we are working tirelessly to fix the issue.'], 500);
        }
    }

    /**
     * Dean rejects review teams assign for PGPRs
     */
    public function rejectReviewTeam(DeanRejectReviewTeamRequest $request): JsonResponse
    {
        try {

            $reviewTeam = ReviewTeam::findOrFail($request->id)->load(['reviewers']);

            if ($reviewTeam->status != "PENDING") {
                return response()->json(['message' => 'You cannot reject a previously accept or rejected review team'], 422);
            }

            $creatorOfReviewTeam = $reviewTeam->qualityAssuranceCouncilOfficer;
            $creatorOfReviewTeam = $creatorOfReviewTeam->user;

            $postGraduateProgram = $reviewTeam->postGraduateReviewProgram;
            $postGraduateProgram = $postGraduateProgram->postGraduateProgram;

            $faculty =  $postGraduateProgram->faculty;

            $dean =  $faculty->deans[0];
            $dean =  $dean->user;

            $university =  $faculty->university;

            // DB::beginTransaction();
            $reviewTeam->status = 'REJECTED';
            $reviewTeam->dean_decision = $request->dean_decision;
            $reviewTeam->remarks = $request->remark ?? 'N/A';

            // send the mail to the qac officer saying that the review team was accepted
            Mail::to($creatorOfReviewTeam->official_email)->send(
                new InformReviewTeamRejectionToQAC(
                    $creatorOfReviewTeam,
                    $reviewTeam,
                    $dean,
                    $postGraduateProgram,
                    $faculty,
                    $university,
                    "Dean of $faculty->name in $university->name has rejected the appointed review team",
                    "mail.informReviewTeamRejectionToQAC"
                )
            );
            $reviewTeam->save();
            DB::commit();
            return response()->json(['message' => 'Your request is duly noted.']);
        } catch (ModelNotFoundException $exception) {
            DB::rollBack();
            return response()->json(
                ['message' => 'Sorry we cannot find the review team that you requested in our database, please check and try again'],
                422
            );
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => 'Something bad has happened, we are working tirelessly to fix the issue.'], 500);
        }
    }
}
