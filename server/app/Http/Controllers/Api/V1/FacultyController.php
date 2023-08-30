<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\FacultyFilter;
use App\Http\Resources\V1\FacultyCollection;
use App\Http\Resources\V1\FacultyResource;
use App\Http\Resources\V1\PostGraduateProgramCollection;
use App\Http\Resources\V1\UniversityResource;
use App\Models\Faculty;
use App\Http\Requests\V1\StoreFacultyRequest;
use App\Http\Requests\V1\UpdateFacultyRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\DeanResource;
use App\Models\InternalQualityAssuranceUnit;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try{
            $filter = new FacultyFilter($request -> session() -> get('authRole'), $request);

            $queryItems = $filter -> getEloQuery();   //[column, operator, value]

            $faculties = Faculty::where($queryItems);

            //including related data
            $university = $request -> query('includeUniversity');
            if($university){
                $faculties = $faculties -> with('university');
            }

            $iqau = $request -> query('includeIQAU');
            if($iqau){
                $faculties = $faculties -> with('internalQualityAssuranceUnit');
            }

            $dean = $request -> query('includeDean');
            if($dean){
                $faculties = $faculties -> with('dean:id');

                //check if academic staff is included
                $academicStaff = $request -> query('includeAcademicStaff');
                if($academicStaff){
                    $faculties = $faculties -> with(['dean:id' => ['academicStaff:id']]);

                    //check if university side is included
                    $universitySide = $request -> query('includeUniversitySide');
                    if($universitySide){
                        $faculties = $faculties -> with(['dean:id' => ['academicStaff:id' => ['universitySide:id']]]);

                        //check if user is included
                        $user = $request -> query('includeUser');
                        if($user){
                            $faculties = $faculties -> with(['dean:id' => [
                                'academicStaff:id' => [
                                    'universitySide:id' => ['user:id,initials,surname']
                                    ]
                                ]
                            ]);
                        }
                    }
                }
            }

            return new FacultyCollection($faculties);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the faculties',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFacultyRequest $request)
    {
        try{
            //authorize request
            $this -> authorize('create', Faculty::class);

            $validatedData = $request->validated();

            DB::beginTransaction();

            //first create the faculty
            $faculty = Faculty::create($validatedData);

            $facultyID = $faculty->id;

            //get the iqau data from the validated data (prefix with iqau_)
            $iqauDetails = [];

            foreach ($validatedData as $key => $value) {
                if (Str::startsWith($key, 'iqau_')) {
                    $iqauDetails[Str::after($key, 'iqau_')] = $value;
                }
            }

            //add the faculty id to the iqau data
            $iqauDetails['faculty_id'] = $facultyID;

            //create the iqau
            InternalQualityAssuranceUnit::create($iqauDetails);
            DB::commit();

            return response()->json([
                'message' => 'Faculty created successfully',
                'data' => new FacultyResource($faculty)
            ], 201);

        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }

        //return new FacultyResource(Faculty::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Faculty $faculty)
    {
        try{
            //including related data
            $university = request() -> query('includeUniversity');
            if($university){
                $faculty = $faculty -> loadMissing('university');
            }

            $iqau = request() -> query('includeIQAU');
            if($iqau){
                $faculty = $faculty -> loadMissing('internalQualityAssuranceUnit');
            }

            $dean = request() -> query('includeDean');
            if($dean){
                //check if academic staff is included
                $academicStaff = request() -> query('includeAcademicStaff');
                if($academicStaff){
                    //check if university side is included
                    $universitySide = request() -> query('includeUniversitySide');
                    if($universitySide){
                        //check if user is included
                        $user = request() -> query('includeUser');
                        if($user){
                            $faculty = $faculty -> load(['dean:id' => [
                                'academicStaff:id' => [
                                    'universitySide:id' => ['user:id,initials,surname']
                                    ]
                                ]
                            ]);
                        }
                        else{
                            $faculty = $faculty -> load(['dean:id' => ['academicStaff:id' => ['universitySide:id']]]);
                        }
                    }
                    else{
                        $faculty = $faculty -> load(['dean:id' => ['academicStaff:id']]);
                    }
                }
                else{
                    $faculty = $faculty -> loadMissing('dean:id');
                }
            }

            return new FacultyResource($faculty);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the faculty',
                'error' => $e -> getMessage()
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyRequest $request, Faculty $faculty)
    {
        try{
            //authorize the request
            $this -> authorize('update', $faculty);

            $validatedData = $request -> validated();

            //get the iqau data from the validated data (prefix with iqau_)
            $iqauDetails = [];

            foreach ($validatedData as $key => $value) {
                if (Str::startsWith($key, 'iqau_')) {
                    $iqauDetails[Str::after($key, 'iqau_')] = $value;
                }
            }

            DB::beginTransaction();

            //update the faculty
            $faculty -> update($validatedData);

            //update the iqau
            $faculty -> internalQualityAssuranceUnit -> update($iqauDetails);

            DB::commit();

            return response()->json([
                'message' => 'Faculty updated successfully',
                'data' => new FacultyResource($faculty)
            ], 200);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faculty $faculty)
    {
        //
    }

    //get all post graduate programs of a faculty
    public function postGraduatePrograms(Faculty $faculty){
        try{
            return new PostGraduateProgramCollection($faculty -> postGraduatePrograms);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the post graduate programs',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    //get current dean of a faculty
    public function currentDean(Faculty $faculty){
        try{
            $dean = $faculty -> currentDean;

            if($dean){
                //related data
                $academicStaff = request() -> query('includeAcademicStaff');
                if($academicStaff){
                    //check if university side is included
                    $universitySide = request() -> query('includeUniversitySide');
                    if($universitySide){
                        //check if user is included
                        $user = request() -> query('includeUser');
                        if($user){
                            $dean = $dean -> load(['academicStaff:id' => [
                                'universitySide:id' => ['user:id,initials,surname']
                                ]
                            ]);
                        }
                        else{
                            $dean = $dean -> load(['academicStaff:id' => ['universitySide:id']]);
                        }
                    }
                    else{
                        $dean = $dean -> loadMissing('academicStaff:id');
                    }
                }
                return new DeanResource($dean);
            }
            else{
                return response() -> json([
                    'message' => 'The faculty does not have a dean'
                ], 404);
            }
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the dean',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    //get the university of a faculty
    public function university(Faculty $faculty){
        try{
            $university = $faculty -> university;

            if($university){
                //related data
                return new UniversityResource($university);
            }
            else{
                return response() -> json([
                    'message' => 'The faculty does not have a university'
                ], 404);
            }
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the university',
                'error' => $e -> getMessage()
            ], 500);
        }
    }
}
