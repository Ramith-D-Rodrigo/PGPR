<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\PostGraduateProgramFilter;
use App\Http\Requests\V1\StorePostGraduateProgramRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramRequest;
use App\Http\Resources\V1\PostGraduateProgramResource;
use App\Models\PostGraduateProgram;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostGraduateProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //role wise authorization
        //authorized roles = [dean, cqa_director, qac_officer, qac_director, reviewer, vice_chancellor, programme_coordinator, iqau_director]
        //dean, iqau_director, programme_coordinator can view only their faculty pgps
        //cqa_director, vice_chancellor can view all pgps of their university
        //qac_director, qac_officer can view all the pgps in the system


        $filter = new PostGraduateProgramFilter();

        $queryItems = $filter -> transform($request);   //[column, operator, value]
        try{
            $role = $request -> session() -> get('authRole');
            if($role === 'dean' || $role === 'iqau_director' || $role === 'programme_coordinator'){
                $user = Auth::user();
                $facultyID = null;
                switch($role){
                    case 'dean':
                        $facultyID = $user -> universitySide -> academicStaff -> dean -> faculty_id;
                        break;
                    case 'iqau_director':
                        $facultyID = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty_id;
                        break;
                    case 'programme_coordinator':
                        $facultyID = $user -> universitySide -> academicStaff -> programmeCoordinator -> faculty_id;
                        break;
                }

                //find the column faculty_id in query items
                $facultyIdIndex = array_search('faculty_id', array_column($queryItems, 0));

                //replace the faculty_id with the faculty id of the user
                if($facultyIdIndex !== false){ //if faculty_id is present in the query items
                    $queryItems[$facultyIdIndex][2] = $facultyID;
                }
                else{
                    $queryItems[] = ['faculty_id', '=', $facultyID];
                }
            }
            else if($role == 'cqa_director' || $role == 'vice_chancellor'){

            }
            else if($role == 'qac_director' || $role == 'qac_officer'){

            }
            if(count($queryItems) > 0){
                $pgps = PostGraduateProgram::where($queryItems) -> paginate();

                return new PostGraduateProgramCollection($pgps -> appends($request -> query()));    //pagination should include the query params
            }
            return new PostGraduateProgramCollection(PostGraduateProgram::paginate());
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
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
    public function store(StorePostGraduateProgramRequest $request)
    {
        return new PostGraduateProgramResource(PostGraduateProgram::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgram $postGraduateProgram)
    {
        return new PostGraduateProgramResource($postGraduateProgram);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostGraduateProgram $postGraduateProgram)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramRequest $request, PostGraduateProgram $postGraduateProgram)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgram $postGraduateProgram)
    {
        //
    }
}
