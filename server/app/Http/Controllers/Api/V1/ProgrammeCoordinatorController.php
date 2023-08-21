<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\ProgrammeCoordinatorFilter;
use App\Http\Resources\V1\PostGraduateProgramResource;
use App\Http\Resources\V1\ProgrammeCoordinatorCollection;
use App\Http\Resources\V1\ProgrammeCoordinatorResource;
use App\Mail\sendPassword;
use App\Models\ProgrammeCoordinator;
use App\Http\Requests\V1\StoreProgrammeCoordinatorRequest;
use App\Http\Requests\V1\UpdateProgrammeCoordinatorRequest;
use App\Http\Controllers\Controller;
use App\Models\PostGraduateProgram;
use App\Services\V1\ProgrammeCoordinatorService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProgrammeCoordinatorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {


        try{

            $filter = new ProgrammeCoordinatorFilter($request -> session() -> get('authRole'), $request);

            $queryItems = $filter -> getEloQuery();   //[column, operator, value]

            $programmeCoordinators = ProgrammeCoordinator::where($queryItems);

            //where in and where not in query
            $whereInQueryItems = $filter -> getWhereInQuery();

            foreach($whereInQueryItems as $whereInQueryItem){
                $programmeCoordinators = $programmeCoordinators -> whereIn($whereInQueryItem[0], $whereInQueryItem[1]);
            }

            $whereNotInQueryItems = $filter -> getWhereNotInQuery();

            foreach($whereNotInQueryItems as $whereNotInQueryItem){
                $programmeCoordinators = $programmeCoordinators -> whereNotIn($whereNotInQueryItem[0], $whereNotInQueryItem[1]);
            }

            //check for flag for getting related data
            //related data will be -> academic staff -> university side -> user, post graduate programme
            $academicStaff = $request -> query('includeAcademicStaff');
            $postGraduateProgramme = $request -> query('includePostGraduateProgramme');

            if($academicStaff){
                $programmeCoordinators = $programmeCoordinators -> with('academicStaff');
                //check for university side
                $universitySide = $request -> query('includeUniversitySide');
                if($universitySide){
                    $programmeCoordinators = $programmeCoordinators -> with(['academicStaff' => ['universitySide']]);
                    //check for user
                    $user = $request -> query('includeUser');
                    if($user){
                        $programmeCoordinators = $programmeCoordinators -> with(['academicStaff' => [
                            'universitySide' => ['user']
                            ]
                        ]);
                    }
                }
            }

            if($postGraduateProgramme){
                $programmeCoordinators = $programmeCoordinators -> with('postGraduateProgram');
            }

            return new ProgrammeCoordinatorCollection($programmeCoordinators -> paginate() -> appends($request -> query()));
        }
        catch(Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the programme coordinators',
                'error' => $e -> getMessage()
            ], 500);
        }
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

            //update the programme coordinator id in the post graduate programme (cannot use eloquent relationship because the post graduate programme is not created yet (transaction))
            $postGraduateProgramId = $validatedData['post_grad_program_id'];
            $pgp = PostGraduateProgram::findOrFail($postGraduateProgramId);
            $pgp -> programme_coordinator_id = $programmeCoordinator -> id;
            $pgp -> save();

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
        //include the related data
        $academicStaff = request() -> query('includeAcademicStaff');

        if($academicStaff){
            //check for university side
            $universitySide = request() -> query('includeUniversitySide');
            if($universitySide){
                //check for user
                $user = request() -> query('includeUser');
                if($user){
                    $programmeCoordinator = $programmeCoordinator -> load(['academicStaff' => [
                        'universitySide' => ['user']
                        ]
                    ]);
                }
                else{
                    $programmeCoordinator = $programmeCoordinator -> load(['academicStaff' => ['universitySide']]);
                }
            }
            else{
                $programmeCoordinator = $programmeCoordinator -> loadMissing('academicStaff');
            }
        }
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

    //get the post graduate program of the programme coordinator
    public function postGraduateProgram(ProgrammeCoordinator $programmeCoordinator){
        try{
            $pgp = $programmeCoordinator -> postGraduateProgram;

            return new PostGraduateProgramResource($pgp);
        }
        catch(Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the post graduate programme',
                'error' => $e -> getMessage()
            ], 500);
        }
    }
}
