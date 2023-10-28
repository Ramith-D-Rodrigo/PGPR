<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\DeanFilter;
use App\Http\Resources\V1\DeanCollection;
use App\Http\Requests\V1\DeanAcceptReviewTeamRequest;
use App\Http\Requests\V1\DeanRejectReviewTeamRequest;
use App\Http\Resources\V1\DeanResource;
use App\Mail\InformReviewTeamAcceptanceToQAC;
use App\Mail\InformReviewTeamRejectionToQAC;
use App\Mail\RejectReviewerRole;
use App\Http\Resources\V1\FacultyResource;
use App\Models\Dean;
use App\Http\Requests\V1\StoreDeanRequest;
use App\Http\Requests\V1\UpdateDeanRequest;
use App\Http\Controllers\Controller;
use App\Mail\sendPassword;
use App\Models\DeskEvaluation;
use App\Models\Faculty;
use App\Models\ReviewTeam;
use App\Services\V1\DeanService;
use App\Services\V1\PostGraduateProgramReviewService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
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
        try {
            $filter = new DeanFilter(request()->session()->get('authRole'), request());

            $queryItems = $filter->getEloQuery();

            $deans = Dean::where($queryItems);

            //where in and where not in query items

            $whereInQueryItems = $filter->getWhereInQuery();
            foreach ($whereInQueryItems as $whereInQueryItem) {
                $deans = $deans->whereIn($whereInQueryItem[0], $whereInQueryItem[1]);
            }

            $whereNotInQueryItems = $filter->getWhereNotInQuery();
            foreach ($whereNotInQueryItems as $whereNotInQueryItem) {
                $deans = $deans->whereNotIn($whereNotInQueryItem[0], $whereNotInQueryItem[1]);
            }

            //related data

            $academicStaff = request()->query('includeAcademicStaff');
            if ($academicStaff) {
                $deans = $deans->with('academicStaff');

                $uniSide = request()->query('includeUniversitySide');

                if ($uniSide) {
                    $deans = $deans->with(['academicStaff' => ['universitySide']]);

                    $user = request()->query('includeUser');

                    if ($user) {
                        $deans = $deans->with(['academicStaff' => ['universitySide' => ['user']]]);
                    }
                }
            }

            $faculty = request()->query('includeFaculty');

            if ($faculty) {
                $deans = $deans->with('faculty');
            }
            return new DeanCollection($deans->get());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeanRequest $request)
    {
        try {
            $this->authorize('create', [Dean::class, $request]);

            //set needed additional fields

            $validatedData = $request->validated(); //get the validated data

            $validatedData['status'] = 'Pending'; //set the status (user account status)
            $validatedData['current_status'] = 'Active';   //set the current status (dean status)
            $validatedData['roles'] = ['dean']; //set the roles (dean role)


            $password = Str::random(8);  //generate a random password
            //hash the password using Hash facade

            $validatedData['password'] = Hash::make($password); //set the password

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

            return response()->json([
                'message' => 'Dean created successfully',
                'data' => new DeanResource($dean)
            ], 201);

        } catch (AuthorizationException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
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
        try {
            //include related data
            $academicStaff = request()->query('includeAcademicStaff');

            if ($academicStaff) {
                $uniSide = request()->query('includeUniversitySide');

                if ($uniSide) {
                    $user = request()->query('includeUser');

                    if ($user) {
                        $dean = $dean->load(['academicStaff' => ['universitySide' => ['user']]]);
                    } else {
                        $dean = $dean->load(['academicStaff' => ['universitySide']]);
                    }
                } else {
                    $dean = $dean->loadMissing('academicStaff');
                }
            }

            $faculty = request()->query('includeFaculty');

            if ($faculty) {
                $dean = $dean->loadMissing('faculty');
            }

            return new DeanResource($dean);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
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
            $this -> authorize('authorizeAcceptReviewTeam', [Dean::class, $request]);

            $reviewTeam = ReviewTeam::findOrFail($request->id)->load(['reviewers']);

            if ($reviewTeam->status != "PENDING") {
                return response()->json(['message' => 'You cannot accept a previously accept or rejected review team'], 422);
            }

            $creatorOfReviewTeam = $reviewTeam->qualityAssuranceCouncilOfficer;
            $creatorOfReviewTeam = $creatorOfReviewTeam->user;

            $pgpr = $reviewTeam->postGraduateReviewProgram;
            $postGraduateProgram = $pgpr->postGraduateProgram;

            $faculty = $postGraduateProgram->faculty;

            $dean = $faculty->deans[0];
            $dean = $dean->user;

            $university = $faculty->university;

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

            //check whether self evaluation is submitted or not
            if($pgpr -> status_of_pgpr == 'SUBMITTED'){ //ser is submitted, and review team accepted
                //then we have to store the evidences in the google drive
                $flag = PostGraduateProgramReviewService::StoreEvidencesInSystemDrive($pgpr);
                if($flag){
                    //if the evidences are stored successfully, then we can create the desk evaluation

                    //after storing, we can create the desk evaluation
                    $deskEvaluation = new DeskEvaluation();
                    $deskEvaluation->pgpr_id = $reviewTeam->pgpr_id;
                    $deskEvaluation->start_date = NULL; // or to set this is current time use => Carbon::now()
                    $deskEvaluation->end_date = NULL;
                    $deskEvaluation->save();

                    //change the status of the pgpr to desk evaluation
                    $pgpr->status_of_pgpr = 'DE';
                    $pgpr->save();

                    DB::commit();

                    return response()->json(['message' => 'Your request is duly noted.']);
                }

                //if the evidences are not stored successfully, then we have to rollback the transaction
                DB::rollBack();
                return response()->json(['message' => 'An Error occurred while processing your request. Please Try again'], 500);

            }
            //no need to store the evidences in the system drive, because the ser is not submitted yet thus no desk evaluation is created
            DB::commit();
            return response()->json(['message' => 'Your request is duly noted.']);

        }catch(AuthorizationException $e){
            return response() -> json(
                ['message' => $e -> getMessage()], 403
            );

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
            $this -> authorize('authorizeRejectReviewTeam', [Dean::class, $request]);

            $reviewTeam = ReviewTeam::findOrFail($request->id)->load(['reviewers']);

            if ($reviewTeam->status != "PENDING") {
                return response()->json(['message' => 'You cannot reject a previously accept or rejected review team'], 422);
            }

            $creatorOfReviewTeam = $reviewTeam->qualityAssuranceCouncilOfficer;
            $creatorOfReviewTeam = $creatorOfReviewTeam->user;

            $postGraduateProgram = $reviewTeam->postGraduateReviewProgram;
            $postGraduateProgram = $postGraduateProgram->postGraduateProgram;

            $faculty = $postGraduateProgram->faculty;

            $dean = $faculty->deans[0];
            $dean = $dean->user;

            $university = $faculty->university;

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

        }catch(AuthorizationException $e){
            return response() -> json(
                ['message' => $e -> getMessage()], 403
            );

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


    //get the faculty of the dean
    public function faculty(Dean $dean)
    {
        try {
            $faculty = $dean->faculty;

            if ($faculty) {
                return new FacultyResource($faculty);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get the faculty of the dean', 'error' => $e->getMessage()], 500);
        }
    }

    public function removeRole(Dean $dean)
    {
        try {
            $this->authorize('removeRole', $dean);

            DB::beginTransaction();

            $result = DeanService::removeRole($dean);

            DB::commit();

            return response()->json([
                'message' => 'Dean role removed successfully',
            ], 200);
        } catch (AuthorizationException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to remove dean role', 'error' => $e->getMessage()], 500);
        }
    }
}
