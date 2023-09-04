<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\ProgrammeCoordinatorFilter;
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
        $filter = new ProgrammeCoordinatorFilter();

        $queryItems = $filter -> transform($request);   //[column, operator, value]

        try{
            $role = $request -> session() -> get('authRole');

            if(in_array($role, ['cqa_director', 'vice_chancellor'])){   //these two can view only their university coordinators
                //get the facultyid in query items
                $facultyIdIndex = array_search('faculty_id', array_column($queryItems, 0));

                //change the operator to = and value to faculties of the university
                if($facultyIdIndex !== false){
                    $queryItems[$facultyIdIndex][1] = '=';
                    $queryItems[$facultyIdIndex][2] = Auth::user() -> universitySide -> university -> faculties -> pluck('id') -> toArray();
                }
                else{
                    $queryItems[] = ['faculty_id', '=', Auth::user() -> universitySide -> university -> faculties -> pluck('id') -> toArray()];
                }
            }
            else if(in_array($role, ['dean', 'iqau_director'])){ //these two can view only their faculty coordinators
                //get the facultyid in query items
                $facultyIdIndex = array_search('faculty_id', array_column($queryItems, 0));
                $facultyId = null;
                if($role === 'dean'){
                    $facultyId = Auth::user() -> universitySide -> academicStaff -> dean -> faculty -> id;
                }
                else{
                    $facultyId = Auth::user() -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty -> id;
                }

                //change the operator to = and value to faculty of the user
                if($facultyIdIndex !== false){
                    $queryItems[$facultyIdIndex][1] = '=';
                    $queryItems[$facultyIdIndex][2] = $facultyId;
                }
                else{
                    $queryItems[] = ['faculty_id', '=', $facultyId];
                }
            }
            else if(in_array($role, ['qac_officer', 'qac_director', 'reviewer'])){
                //they have no restrictions
                //so do nothing
            }

            $programmeCoordinators = ProgrammeCoordinator::where($queryItems);

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
