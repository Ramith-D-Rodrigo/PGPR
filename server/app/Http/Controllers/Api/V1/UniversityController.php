<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\UniversityFilter;
use App\Http\Resources\V1\FacultyCollection;
use App\Http\Resources\V1\PostGraduateProgramCollection;
use App\Models\University;
use App\Http\Requests\V1\StoreUniversityRequest;
use App\Http\Requests\V1\UpdateUniversityRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UniversityResource;
use App\Http\Resources\V1\UniversityCollection;
use App\Http\Resources\V1\ViceChancellorResource;
use App\Models\CenterForQualityAssurance;
use App\Services\V1\UniversityService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class UniversityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $filter = new UniversityFilter(request() -> session() -> get('authRole'), request());

            $queryItems = $filter -> getEloQuery();

            $universities = University::where($queryItems);

            //related data
            $cqa = request() -> query('includeCQA');
            if($cqa){
                $universities = $universities -> with(['centerForQualityAssurance' => [
                    'currentQualityAssuranceDirector' => [
                        'qualityAssuranceStaff' => [
                            'universitySide' => [
                                'user:id,initials,surname,profile_pic'
                            ]
                        ]
                    ]
                ]]);
            }

            $vc = request() -> query('includeViceChancellor');
            if($vc){
                $universities = $universities -> with('viceChancellor:id');

                //check if university side is included
                $universitySide = request() -> query('includeUniversitySide');
                if($universitySide){
                    $universities = $universities -> with(['viceChancellor:id' => ['universitySide:id']]);

                    //check if user is included
                    $user = request() -> query('includeUser');
                    if($user){
                        $universities = $universities -> with(['viceChancellor:id' => ['universitySide:id' => ['user:id,initials,surname']]]);
                    }
                }
            }
            return new UniversityCollection($universities -> get());
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUniversityRequest $request)
    {
        try{
            //authorize request
            $this -> authorize('create', University::class);

            $validatedData = $request -> validated();
            //begin db transaction
            DB::beginTransaction();
            $university = UniversityService::create($validatedData);
            //commit db transactions
            DB::commit();

            return response()->json([
                'message' => 'University created successfully',
                'data' => new UniversityResource($university)
            ], 201);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e -> getMessage()
            ], 403);
        }
        catch(\Exception $e){
            //rollback db transactions
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(University $university)
    {
        try{
            //check if cqa is included
            $cqa = request() -> query('includeCQA');
            if($cqa){
                $university = $university -> load(['centerForQualityAssurance' => [
                    'currentQualityAssuranceDirector' => [
                        'qualityAssuranceStaff' => [
                            'universitySide' => [
                                'user:id,initials,surname,profile_pic'
                            ]
                        ]
                    ]
                ]]);
            }

            //check if vc is included
            $vc = request() -> query('includeViceChancellor');
            if($vc){
                //check if university side is included
                $universitySide = request() -> query('includeUniversitySide');
                if($universitySide){
                    //check if user is included
                    $user = request() -> query('includeUser');
                    if($user){
                        $university = $university -> load(['viceChancellor:id' => ['universitySide:id' => ['user:id,initials,surname']]]);
                    }
                    else{
                        $university = $university -> load(['viceChancellor:id' => ['universitySide:id']]);
                    }
                }
                else{
                    $university = $university -> loadMissing('viceChancellor:id');
                }
            }

            return new UniversityResource($university);
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniversityRequest $request, University $university)
    {
        try{
            //authorize request
            $this -> authorize('update', $university);

            $validatedData = $request -> validated();

            //begin db transaction
            DB::beginTransaction();
            $university = UniversityService::update($validatedData, $university);
            //commit db transactions
            DB::commit();

            return response()->json([
                'message' => 'University updated successfully',
                'data' => new UniversityResource($university)
            ], 200);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e -> getMessage()
            ], 403);
        }
        catch(\Exception $e){
            //rollback db transactions
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(University $university)
    {
        //
    }


    //get all faculties of a university
    public function faculties(University $university)
    {
        try{
            $faculties = $university -> faculties;
            return new FacultyCollection($faculties);
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    //get all postgraduate programs of a university
    public function postgraduatePrograms(University $university){
        try{
            //get all faculties of a university
            $faculties = $university -> faculties;

            //get all postgraduate programs of a university as a single model collection
            $postgraduatePrograms = collect();
            foreach($faculties as $faculty){
                $postgraduatePrograms = $postgraduatePrograms -> merge($faculty -> postGraduatePrograms);
            }

            return new PostGraduateProgramCollection($postgraduatePrograms);
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    //get current vice chancellor of a university
    public function currentViceChancellor(University $university)
    {
        try{
            $viceChancellor = $university -> viceChancellor;

            if($viceChancellor){
                //related data
                $universitySide = request() -> query('includeUniversitySide');
                if($universitySide){
                    //user data
                    $user = request() -> query('includeUser');
                    if($user){
                        $viceChancellor = $viceChancellor -> loadMissing(['universitySide:id' => ['user:id,initials,surname']]);
                    }
                    else{
                        $viceChancellor = $viceChancellor -> loadMissing('universitySide:id');
                    }
                }
                return new ViceChancellorResource($viceChancellor);
            }
            else{
                return response()->json([
                    'message' => 'No vice chancellor found for this university'
                ], 404);
            }
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }
}
