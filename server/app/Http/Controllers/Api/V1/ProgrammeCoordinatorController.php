<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\ProgrammeCoordinatorResource;
use App\Mail\sendPassword;
use App\Models\ProgrammeCoordinator;
use App\Http\Requests\V1\StoreProgrammeCoordinatorRequest;
use App\Http\Requests\V1\UpdateProgrammeCoordinatorRequest;
use App\Http\Controllers\Controller;
use App\Services\V1\ProgrammeCoordinatorService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProgrammeCoordinatorController extends Controller
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
    public function store(StoreProgrammeCoordinatorRequest $request)
    {
        $validatedData = $request -> validated();

        //store the other required data
        $validatedData['status'] = 'Pending';
        $validatedData['current_status'] = 'Active';
        $validatedData['roles'] = ['programme_coordinator'];

        $password = Str::random(8);

        $validatedData['password'] = Hash::make($password);

        try{
            DB::beginTransaction();

            //store the files
            $validatedDataWithStoredFiles = ProgrammeCoordinatorService::storeFiles($validatedData);

            $programmeCoordinator = ProgrammeCoordinatorService::create($validatedDataWithStoredFiles);

            //send email to the dean
            ProgrammeCoordinatorService::sendAccountCreateMail($validatedDataWithStoredFiles, $password);
            DB::commit();   //commit the changes if all of them were successful
            return new ProgrammeCoordinatorResource($programmeCoordinator);
        }
        catch(Exception $e){
            DB::rollBack(); //discard the changes if any of them failed
            return response() -> json([
                'message' => 'Failed to create the programme coordinator',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProgrammeCoordinator $programmeCoordinator)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProgrammeCoordinator $programmeCoordinator)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgrammeCoordinatorRequest $request, ProgrammeCoordinator $programmeCoordinator)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProgrammeCoordinator $programmeCoordinator)
    {
        //
    }
}
