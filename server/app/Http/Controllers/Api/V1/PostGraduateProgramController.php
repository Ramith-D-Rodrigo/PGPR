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
        try{
            $filter = new PostGraduateProgramFilter($request -> session() -> get('authRole'), $request);

            $queryItems = $filter -> getEloQuery();   //[column, operator, value]
            //role authorization done in the middleware
            $pgps = PostGraduateProgram::where($queryItems) -> paginate();
            return new PostGraduateProgramCollection($pgps -> appends($request -> query()));    //pagination should include the query params
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
        //add authorized cqa director id to the request
        $request['added_by_cqa_director_id'] = Auth::user() -> id;
        return new PostGraduateProgramResource(PostGraduateProgram::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgram $postGraduateProgram)
    {
        try{
            $faculty = request() -> query('includeFaculty');
            if($faculty){
                $postGraduateProgram -> loadMissing('faculty');
            }

            $currCoordinator = request() -> query('includeCurrentCoordinator');
            if($currCoordinator){
                $postGraduateProgram -> loadMissing('currentProgrammeCoordinator');

                //check if academic staff is included
                $academicStaff = request() -> query('includeAcademicStaff');
                if($academicStaff){
                    $postGraduateProgram -> loadMissing(['currentProgrammeCoordinator' => ['academicStaff']]);

                    //check if university side is included
                    $universitySide = request() -> query('includeUniversitySide');
                    if($universitySide){
                        $postGraduateProgram -> loadMissing(['currentProgrammeCoordinator' => [
                            'academicStaff' => ['universitySide']
                            ]
                        ]);

                        //check if user is included
                        $user = request() -> query('includeUser');
                        if($user){
                            $postGraduateProgram -> loadMissing(['currentProgrammeCoordinator' => [
                                'academicStaff' => [
                                    'universitySide' => ['user']
                                    ]
                                ]
                            ]);
                        }
                    }
                }
            }

            return new PostGraduateProgramResource($postGraduateProgram);
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
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
