<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\UniversityResource;
use App\Http\Resources\V1\ViceChancellorResource;
use App\Models\University;
use App\Models\ViceChancellor;
use App\Http\Requests\V1\StoreViceChancellorRequest;
use App\Http\Requests\V1\UpdateViceChancellorRequest;
use App\Http\Controllers\Controller;
use App\Services\V1\ViceChancellorService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ViceChancellorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreViceChancellorRequest $request)
    {
        try{
            //authorize the request
            $this->authorize('create', ViceChancellor::class);

            $validatedData = $request->validated();

            //insert additional data to validated data
            $validatedData['status'] = 'pending';
            $validatedData['roles'] = ['vice_chancellor'];
            $validatedData['vc_status'] = 'ACTIVE';
            //term date is appointed date + 5 years
            $validatedData['term_date'] = date('Y-m-d', strtotime('+5 years', strtotime($validatedData['appointed_date'])));

            //create a random password
            $password = Str::random(8);

            //hash the password
            $validatedData['password'] = Hash::make($password);

            DB::beginTransaction();

            //store the files( profile picture)
            $validatedData = ViceChancellorService::storeFiles($validatedData);

            $viceChancellor = ViceChancellorService::create($validatedData);

            //add vice chancellor to the university
            //find the university
            $university = University::findOrFail($validatedData['university_id']);

            //update the vice chancellor id in the university table
            $university->update(['vice_chancellor_id' => $viceChancellor -> id]);

            //send mail
            ViceChancellorService::sendAccountCreateMail($validatedData, $password);
            DB::commit();

            return response() -> json([
                'message' => 'Vice chancellor created successfully',
                'data' => new ViceChancellorResource($viceChancellor)
            ], 201);
        }
        catch(AuthorizationException $e){
            return response() -> json([
                'message' => $e -> getMessage()
            ], 403);
        }
       catch(\Exception $e){
            DB::rollBack();
            return response() -> json([
                'message' => 'Failed to create vice chancellor',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ViceChancellor $viceChancellor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ViceChancellor $viceChancellor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateViceChancellorRequest $request, ViceChancellor $viceChancellor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ViceChancellor $viceChancellor)
    {
        //
    }

    //function to remove the role of vice chancellor (after the term date or if the vice chancellor has ended the term)
    public function removeRole(ViceChancellor $viceChancellor)
    {
        try{
            $this -> authorize('removeRole', $viceChancellor);

            //update the vc status to inactive

            //get the term date from the request
            $termDate = request() -> termDate ?? null;

            //if termdate is null, that means uses the term date from the database
            //else use the term date from the request

            DB::beginTransaction();

            $result = ViceChancellorService::removeRole($viceChancellor, $termDate);

            DB::commit();

            return response() -> json([
                'message' => 'Vice chancellor role removed successfully',
            ], 200);
        }
        catch(AuthorizationException $e){
            return response() -> json([
                'message' => $e -> getMessage()
            ], 403);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response() -> json([
                'message' => 'Failed to remove vice chancellor role',
                'error' => $e -> getMessage()
            ], 500);
        }
    }

    //get the university of the vice chancellor
    public function university(ViceChancellor $viceChancellor)
    {
        try{
            $university = $viceChancellor -> university;

            return new UniversityResource($university);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Failed to retrieve vice chancellor university',
                'error' => $e -> getMessage()
            ], 500);
        }
    }
}
