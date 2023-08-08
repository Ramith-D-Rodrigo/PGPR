<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\UniversityFilter;
use App\Models\University;
use App\Http\Requests\V1\StoreUniversityRequest;
use App\Http\Requests\V1\UpdateUniversityRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UniversityResource;
use App\Http\Resources\V1\UniversityCollection;
use App\Models\CenterForQualityAssurance;
use App\Services\V1\UniversityService;
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
                $universities = $universities -> with('centerForQualityAssurance');
            }

            $vc = request() -> query('includeViceChancellor');
            if($vc){
                $universities = $universities -> with('viceChancellor');

                //check if university side is included
                $universitySide = request() -> query('includeUniversitySide');
                if($universitySide){
                    $universities = $universities -> with(['viceChancellor' => ['universitySide']]);

                    //check if user is included
                    $user = request() -> query('includeUser');
                    if($user){
                        $universities = $universities -> with(['viceChancellor' => ['universitySide' => ['user']]]);
                    }
                }
            }

            return new UniversityCollection($universities -> paginate() -> appends(request() -> query()));
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
        $validatedData = $request -> validated();

        try{
            //begin db transaction
            DB::beginTransaction();
            $university = UniversityService::create($validatedData);
            //commit db transactions
            DB::commit();
            return new UniversityResource($university);
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
                $university = $university -> loadMissing('centerForQualityAssurance');
            }

            //check if vc is included
            $vc = request() -> query('includeViceChancellor');
            if($vc){
                $university = $university -> loadMissing('viceChancellor');

                //check if university side is included
                $universitySide = request() -> query('includeUniversitySide');
                if($universitySide){
                    $university = $university -> loadMissing(['viceChancellor' => ['universitySide']]);

                    //check if user is included
                    $user = request() -> query('includeUser');
                    if($user){
                        $university = $university -> loadMissing(['viceChancellor' => ['universitySide' => ['user']]]);
                    }
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(University $university)
    {
        //
    }
}
