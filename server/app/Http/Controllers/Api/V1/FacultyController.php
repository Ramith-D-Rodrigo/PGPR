<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\FacultyFilter;
use App\Http\Resources\V1\FacultyCollection;
use App\Http\Resources\V1\FacultyResource;
use App\Models\Faculty;
use App\Http\Requests\V1\StoreFacultyRequest;
use App\Http\Requests\V1\UpdateFacultyRequest;
use App\Http\Controllers\Controller;
use App\Models\InternalQualityAssuranceUnit;
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
                $faculties = $faculties -> with('dean');

                //check if academic staff is included
                $academicStaff = $request -> query('includeAcademicStaff');
                if($academicStaff){
                    $faculties = $faculties -> with(['dean' => ['academicStaff']]);

                    //check if university side is included
                    $universitySide = $request -> query('includeUniversitySide');
                    if($universitySide){
                        $faculties = $faculties -> with(['dean' => ['academicStaff' => ['universitySide']]]);

                        //check if user is included
                        $user = $request -> query('includeUser');
                        if($user){
                            $faculties = $faculties -> with(['dean' => [
                                'academicStaff' => [
                                    'universitySide' => ['user']
                                    ]
                                ]
                            ]);
                        }
                    }
                }
            }

            return new FacultyCollection($faculties -> paginate() -> appends($request -> query()));
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve the faculties',
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
    public function store(StoreFacultyRequest $request)
    {
        try{
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
            return new FacultyResource($faculty);
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
        return new FacultyResource($faculty);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faculty $faculty)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyRequest $request, Faculty $faculty)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faculty $faculty)
    {
        //
    }
}
