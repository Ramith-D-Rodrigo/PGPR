<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\PostGraduateProgramFilter;
use App\Http\Requests\V1\StorePostGraduateProgramRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramRequest;
use App\Http\Resources\V1\PostGraduateProgramResource;
use App\Models\PostGraduateProgram;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramCollection;
use Illuminate\Auth\Access\AuthorizationException;
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
            $pgps = PostGraduateProgram::where($queryItems);

            //where in and where not in
            $whereInQuery = $filter -> getWhereInQuery();
            foreach($whereInQuery as $whereInQueryItem){
                $pgps = $pgps -> whereIn($whereInQueryItem[0], $whereInQueryItem[1]);
            }

            $whereNotInQuery = $filter -> getWhereNotInQuery();
            foreach($whereNotInQuery as $whereNotInQueryItem){
                $pgps = $pgps -> whereNotIn($whereNotInQueryItem[0], $whereNotInQueryItem[1]);
            }

            return new PostGraduateProgramCollection($pgps -> paginate() -> appends($request -> query()));    //pagination should include the query params
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
        try{
            //authorize the request
            $this -> authorize('store', PostGraduateProgram::class);

            //get validated data
            $validatedData = $request -> validated();
            $validatedData['added_by_cqa_director_id'] = Auth::user() -> id;
            PostGraduateProgram::create($validatedData);

            return response() -> json(['message' => 'Post Graduate Program created successfully'], 201);
        }
        catch(AuthorizationException $e){
            return response() -> json(['message' => $e -> getMessage()], 403);
        }
        catch(\Exception $e){
            return response() -> json(['message' => 'Failed to create the postgraduate programme',
                    'error' => $e -> getMessage()
                ], 500);
        }
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
                //check if academic staff is included
                $academicStaff = request() -> query('includeAcademicStaff');
                if($academicStaff){
                    //check if university side is included
                    $universitySide = request() -> query('includeUniversitySide');
                    if($universitySide){
                        //check if user is included
                        $user = request() -> query('includeUser');
                        if($user){
                            $postGraduateProgram -> load(['currentProgrammeCoordinator:id' => [
                                'academicStaff:id' => [
                                    'universitySide:id' => ['user:id,initials,surname']
                                    ]
                                ]
                            ]);
                        }
                        else{
                            $postGraduateProgram -> load(['currentProgrammeCoordinator:id' => [
                                'academicStaff:id' => ['universitySide:id']
                                ]
                            ]);
                        }
                    }
                    else{
                        $postGraduateProgram -> load(['currentProgrammeCoordinator:id' => ['academicStaff:id']]);
                    }
                }
                else{
                    $postGraduateProgram -> loadMissing('currentProgrammeCoordinator:id');
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
        try{
            //authorize the request
            $this -> authorize('update', $postGraduateProgram);

            //get validated data
            $validatedData = $request -> validated();

            //add authorized cqa director id to the validated data
            $validatedData['edited_by_cqa_director_id'] = Auth::user() -> id;
            $postGraduateProgram -> update($validatedData);
            return response() -> json(['message' => 'Post Graduate Program Updated Successfully'], 200);
        }
        catch(AuthorizationException $e){
            return response() -> json(['message' => $e -> getMessage()], 403);
        }

        catch(\Exception $e){
            return response() -> json(['message' => 'Failed to update the postgraduate programme',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgram $postGraduateProgram)
    {
        //
    }

    //get the current coordinator of the post graduate program
    public function currentCoordinator(PostGraduateProgram $postGraduateProgram){
        try{
            $programmeCoordinator = $postGraduateProgram -> currentProgrammeCoordinator;

            if($programmeCoordinator){
                //check if academic staff is included
                $academicStaff = request() -> query('includeAcademicStaff');
                if($academicStaff){
                    //check if university side is included
                    $universitySide = request() -> query('includeUniversitySide');
                    if($universitySide){
                        //check if user is included
                        $user = request() -> query('includeUser');
                        if($user){
                            $programmeCoordinator -> load(['academicStaff:id' => [
                                'universitySide:id' => ['user:id,initials,surname']
                                ]
                            ]);
                        }
                        else{
                            $programmeCoordinator -> load(['academicStaff:id' => ['universitySide:id']]);
                        }
                    }
                    else{
                        $programmeCoordinator -> loadMissing('academicStaff:id');
                    }
                }
            }
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
    }

    //get all postgraduate program reviews
    public function reviews(PostGraduateProgram $postGraduateProgram){
        try{
            $reviews = $postGraduateProgram -> postGraduateProgramReviews;

            //check if academic staff is included
            $academicStaff = request() -> query('includeAcademicStaff');
            if($academicStaff){
                //check if university side is included
                $universitySide = request() -> query('includeUniversitySide');
                if($universitySide){
                    //check if user is included
                    $user = request() -> query('includeUser');
                    if($user){
                        $reviews -> load(['academicStaff:id' => [
                            'universitySide:id' => ['user:id,initials,surname']
                            ]
                        ]);
                    }
                    else{
                        $reviews -> load(['academicStaff:id' => ['universitySide:id']]);
                    }
                }
                else{
                    $reviews -> loadMissing('academicStaff:id');
                }
            }

            return response() -> json(['reviews' => $reviews], 200);
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
    }
}
