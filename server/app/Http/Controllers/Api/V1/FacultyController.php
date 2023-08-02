<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\FacultyCollection;
use App\Http\Resources\V1\FacultyResource;
use App\Models\Faculty;
use App\Http\Requests\V1\StoreFacultyRequest;
use App\Http\Requests\V1\UpdateFacultyRequest;
use App\Http\Controllers\Controller;
use App\Models\InternalQualityAssuranceUnit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new FacultyCollection(Faculty::paginate());
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
