<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\InternalQualityAssuranceUnitDirectorResource;
use App\Models\Faculty;
use App\Models\InternalQualityAssuranceUnitDirector;
use App\Http\Requests\V1\StoreInternalQualityAssuranceUnitDirectorRequest;
use App\Http\Requests\V1\UpdateInternalQualityAssuranceUnitDirectorRequest;
use App\Http\Controllers\Controller;
use App\Models\InternalQualityAssuranceUnit;
use App\Services\V1\InternalQualityAssuranceUnitDirectorService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InternalQualityAssuranceUnitDirectorController extends Controller
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
    public function store(StoreInternalQualityAssuranceUnitDirectorRequest $request)
    {
        try{
            //authorize the action
            $this -> authorize('create', InternalQualityAssuranceUnitDirector::class);


            $validatedData = $request -> validated();
            $validatedData['status'] = 'pending'; //set the status to pending
            $validatedData['roles'] = ['iqau_director']; //set the roles to iqau director

            //random password
            $password = Str::random(8);
            $validatedData['password'] = Hash::make($password); //hash the password

            DB::beginTransaction();

            //store the files (profile pic)
            $validatedDataWithFiles = InternalQualityAssuranceUnitDirectorService::storeFiles($validatedData);

            //create the iqau director
            $iqauDirector = InternalQualityAssuranceUnitDirectorService::create($validatedDataWithFiles);

            //update the iqau with iqau director id
            //we got the iqau id from the prepare for validation function
            $iqauID = $validatedData['iqau_id'];
            $iqau = InternalQualityAssuranceUnit::find($iqauID);
            $iqau -> iqau_dir_id = $iqauDirector -> id;
            $iqau -> save();

            //send email
            InternalQualityAssuranceUnitDirectorService::sendAccountCreateMail($validatedDataWithFiles, $password);

            DB::commit();

            return response()->json([
                'message' => 'Successfully created the internal quality assurance unit director',
                'data' => new InternalQualityAssuranceUnitDirectorResource($iqauDirector)
            ], 201);
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e->getMessage()], 403);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'Failed to create the internal quality assurance unit director', 'error' => $e->getMessage()], 500);

        }


    }

    /**
     * Display the specified resource.
     */
    public function show(InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInternalQualityAssuranceUnitDirectorRequest $request, InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InternalQualityAssuranceUnitDirector $internalQualityAssuranceUnitDirector)
    {
        //
    }
}
