<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\CenterForQualityAssuranceDirectorResource;
use App\Http\Resources\V1\UniversityResource;
use App\Mail\InformUserRoleRevocation;
use App\Models\CenterForQualityAssurance;
use App\Models\CenterForQualityAssuranceDirector;
use App\Http\Requests\V1\StoreCenterForQualityAssuranceDirectorRequest;
use App\Http\Requests\V1\UpdateCenterForQualityAssuranceDirectorRequest;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\V1\CenterForQualityAssuranceDirectorService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CenterForQualityAssuranceDirectorController extends Controller
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
    public function store(StoreCenterForQualityAssuranceDirectorRequest $request)
    {
        try{
            //authorize the action
            $this -> authorize('create', CenterForQualityAssuranceDirector::class);


            $validatedData = $request->validated();
            $validatedData['status'] = 'pending'; //set the status to pending
            $validatedData['roles'] = ['cqa_director']; //set the roles to cqa director

            //random password
            $password = Str::random(8);
            $validatedData['password'] = Hash::make($password); //hash the password

            DB::beginTransaction();

            //store the files (profile pic)
            $validatedDataWithFiles = CenterForQualityAssuranceDirectorService::storeFiles($validatedData);

            //create the cqa director
            $cqaDirector = CenterForQualityAssuranceDirectorService::create($validatedDataWithFiles);

            //update the center for quality assurance director id in the center for quality assurance table
            $cqa  = CenterForQualityAssurance::findOrFail($validatedData['center_for_quality_assurance_id']);

            $cqa -> update(['center_for_quality_assurance_director_id' => $cqaDirector -> id]);
            //send email
            CenterForQualityAssuranceDirectorService::sendAccountCreateMail($validatedDataWithFiles, $password);

            DB::commit();

            return response()->json([
                'message' => 'CQA director account created successfully',
                'data' => new CenterForQualityAssuranceDirectorResource($cqaDirector)
            ], 201);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'Failed to create CQA director account'
                , 'error' => $e -> getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCenterForQualityAssuranceDirectorRequest $request, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {
        //
    }

    public function removeRole(CenterForQualityAssuranceDirector $cqaDirector) {
        try{
            //authorize the action
            $this -> authorize('removeRole', $cqaDirector);

            DB::beginTransaction();

            $result = CenterForQualityAssuranceDirectorService::removeRole($cqaDirector);
            $user = User::find($cqaDirector->id);

            Mail::to($user->official_email)
                        ->send(
                            new InformUserRoleRevocation(
                                user: $user,
                                role: 'Center for Quality Assurance Director',
                                subject: "Access revocation to the platform as Center for Quality Assurance Director",
                                content: 'mail.informUserRoleRevoke'
                            )
                        );

            DB::commit();

            return response() -> json([
                'message' => 'Role removed successfully',
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
                'message' => 'Failed to remove Center For Quality Assurance Director role',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    //get the university of the cqa director
    public function university(CenterForQualityAssuranceDirector $cqaDirector) {
        try{
            $university = $cqaDirector -> centerForQualityAssurance -> university;

            return new UniversityResource($university);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve university',
                'error' => $e -> getMessage()
            ], 500);
        }
    }
}
