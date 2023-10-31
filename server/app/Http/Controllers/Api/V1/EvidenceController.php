<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\EvidenceResource;
use App\Mail\InformEvidenceActionToAuthorities;
use App\Models\Evidence;
use App\Models\SelfEvaluationReport;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\V1\StoreEvidenceRequest;
use App\Http\Requests\V1\UpdateEvidenceRequest;
use App\Services\V1\DriveManager;
use Google_Service_Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EvidenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreEvidenceRequest $request)
    {
        try{
            //authorize the action
            $this->authorize('create', [Evidence::class, $request]);


            $validatedData = $request->validated();
            //convert applicable years to json
            $validatedData['applicable_years'] = json_encode($validatedData['applicable_years']);

            //check if the url is a valid google drive url
            //we can do this by using the DriveManager class
            //if the url is not valid, an exception will be thrown
            //if the url is valid, we have to check if the user has permission to access the file (anyone with the link)
            //if the user has permission, we can proceed to create the evidence
            //if the user does not have permission, we have to throw an exception

            //get the file id from the url
            $driveManager = new DriveManager();
            $fileId = $driveManager -> getFileId($validatedData['url']);

            if($fileId == ""){  //probably a folder
                $fileId = $driveManager -> getFolderId($validatedData['url']);
            }


            //get the permissions of the file
            $permissions = $driveManager -> getPermissions($fileId);

            //check if the user has permission to access the file
            $hasPermission = false;
            foreach($permissions as $permission){
                if($permission -> type == "anyone" && $permission -> role == "writer"){
                    $hasPermission = true;
                    break;
                }
            }

            if(!$hasPermission){
                throw new \Exception("Error while processing the evidence url. Please make sure that the file is shared with anyone with the link and has edit permission");
            }

            DB::beginTransaction();

            $evidence = Evidence::create($validatedData);

            //insert to ser_evidence_standard table
            $evidence -> standards() -> attach($validatedData['standard_id'], [
                'ser_id' => $validatedData['self_evaluation_report_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // IQAU DIR, PROGRAM COORDINATOR
            // get the user data from the SER
            $selfEvaluationReport = SelfEvaluationReport::find($validatedData['self_evaluation_report_id']);
            $postGraduateProgram = $selfEvaluationReport->postGraduateProgramReview->postGraduateProgram;
            $programCoordinator = User::find($selfEvaluationReport->programmeCoordinator->id);
            $iqauDirector = User::find($selfEvaluationReport->internalQualityAssuranceUnitDirector->id);

            //sending the mail to programCoordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformEvidenceActionToAuthorities(
                    user: $programCoordinator,
                    action: 'UPLOAD',
                    evidenceInfo: $evidence,
                    postgraduateProgram: $postGraduateProgram,
                    subject: 'New Evidence Uploaded',
                    content: 'mail.informEvidenceActionToAuthorities'
                )
            );
            //sending the mail to iqauDirector
            Mail::to($iqauDirector->official_email)->send(
                new InformEvidenceActionToAuthorities(
                    user: $iqauDirector,
                    action: 'UPLOAD',
                    evidenceInfo: $evidence,
                    postgraduateProgram: $postGraduateProgram,
                    subject: 'New Evidence Uploaded',
                    content: 'mail.informEvidenceActionToAuthorities'
                )
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Evidence created successfully',
                'data' => new EvidenceResource($evidence)
            ], 201);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 403);
        }
        catch(Google_Service_Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Unable to create evidence',
                'error' =>"Error while processing the evidence url. Please make sure that the file is shared with anyone with the link and has edit permission"
            ], 500);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Unable to create evidence',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvidenceRequest $updateEvidenceRequest, Evidence $evidence){
        try{
            //authorize the action
            $this->authorize('update', $evidence);

            $validatedData = $updateEvidenceRequest->validated();

            //convert applicable years to json
            $validatedData['applicable_years'] = json_encode($validatedData['applicable_years']);

            //get the file id from the url
            $driveManager = new DriveManager();

            if(isset($validatedData['url'])){
                $fileId = $driveManager -> getFileId($validatedData['url']);

                if($fileId == ""){  //probably a folder
                    $fileId = $driveManager -> getFolderId($validatedData['url']);
                }


                //get the permissions of the file
                $permissions = $driveManager -> getPermissions($fileId);

                //check if the user has permission to access the file
                $hasPermission = false;
                foreach($permissions as $permission){
                    if($permission -> type == "anyone" && $permission -> role == "writer"){
                        $hasPermission = true;
                        break;
                    }
                }

                if(!$hasPermission){
                    throw new \Exception("Error while processing the evidence url. Please make sure that the file is shared with anyone with the link and has edit permission");
                }
            }

            DB::beginTransaction();

            $evidence -> update($validatedData);

            // IQAU DIR, PROGRAM COORDINATOR
            // get the user data from the SER
            $selfEvaluationReport = $evidence->selfEvaluationReport[0];
            $postGraduateProgram = $selfEvaluationReport->postGraduateProgramReview->postGraduateProgram;
            $programCoordinator = User::find($selfEvaluationReport->programmeCoordinator->id);
            $iqauDirector = User::find($selfEvaluationReport->internalQualityAssuranceUnitDirector->id);

            //sending the mail to programCoordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformEvidenceActionToAuthorities(
                    user: $programCoordinator,
                    action: 'UPDATE',
                    evidenceInfo: $evidence,
                    postgraduateProgram: $postGraduateProgram,
                    subject: 'Update of Existing Evidence',
                    content: 'mail.informEvidenceActionToAuthorities'
                )
            );
            //sending the mail to iqauDirector
            Mail::to($iqauDirector->official_email)->send(
                new InformEvidenceActionToAuthorities(
                    user: $iqauDirector,
                    action: 'UPDATE',
                    evidenceInfo: $evidence,
                    postgraduateProgram: $postGraduateProgram,
                    subject: 'Update of Existing Evidence',
                    content: 'mail.informEvidenceActionToAuthorities'
                )
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Evidence updated successfully',
                'data' => new EvidenceResource($evidence)
            ], 200);

        }
        catch(AuthorizationException $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 403);
        }
        catch(Google_Service_Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Unable to update evidence',
                'error' =>"Error while processing the evidence url. Please make sure that the file is shared with anyone with the link and has edit permission"
            ], 500);
        }
        catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Unable to update evidence',
                'error' => $e->getTrace()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evidence $evidence)
    {
        try{
            //authorize the action
            $this->authorize('forceDelete', $evidence);

            DB::beginTransaction();

            //remove the pivot record from ser_evidence_standard table
            $evidence -> standards() -> detach();

            $evidence->delete();

            // IQAU DIR, PROGRAM COORDINATOR
            // get the user data from the SER
            $selfEvaluationReport = $evidence->selfEvaluationReport[0];
            $postGraduateProgram = $selfEvaluationReport->postGraduateProgramReview->postGraduateProgram;
            $programCoordinator = User::find($selfEvaluationReport->programmeCoordinator->id);
            $iqauDirector = User::find($selfEvaluationReport->internalQualityAssuranceUnitDirector->id);

            //sending the mail to programCoordinator
            Mail::to($programCoordinator->official_email)->send(
                new InformEvidenceActionToAuthorities(
                    user: $programCoordinator,
                    action: 'DELETE',
                    evidenceInfo: $evidence,
                    postgraduateProgram: $postGraduateProgram,
                    subject: 'Removal of Existing Evidence',
                    content: 'mail.informEvidenceActionToAuthorities'
                )
            );
            //sending the mail to iqauDirector
            Mail::to($iqauDirector->official_email)->send(
                new InformEvidenceActionToAuthorities(
                    user: $iqauDirector,
                    action: 'DELETE',
                    evidenceInfo: $evidence,
                    postgraduateProgram: $postGraduateProgram,
                    subject: 'Removal of Existing Evidence',
                    content: 'mail.informEvidenceActionToAuthorities'
                )
            );

            DB::commit();


            return response()->json([
                'success' => true,
                'message' => 'Evidence deleted successfully',
                'data' => null
            ], 200);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 403);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Unable to delete evidence',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
