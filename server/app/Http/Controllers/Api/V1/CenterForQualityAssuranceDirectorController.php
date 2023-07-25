<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\CenterForQualityAssuranceDirectorResource;
use App\Models\CenterForQualityAssuranceDirector;
use App\Http\Requests\V1\StoreCenterForQualityAssuranceDirectorRequest;
use App\Http\Requests\V1\UpdateCenterForQualityAssuranceDirectorRequest;
use App\Http\Controllers\Controller;
use App\Services\V1\CenterForQualityAssuranceDirectorService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CenterForQualityAssuranceDirectorController extends Controller
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
    public function store(StoreCenterForQualityAssuranceDirectorRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['status'] = 'pending'; //set the status to pending

        //random password
        $password = Str::random(8);
        $validatedData['password'] = Hash::make($password); //hash the password

        try{
            DB::beginTransaction();

            //store the files (profile pic)
            $validatedDataWithFiles = CenterForQualityAssuranceDirectorService::storeFiles($validatedData);

            //create the cqa director
            $cqaDirector = CenterForQualityAssuranceDirectorService::create($validatedDataWithFiles);

            //send email
            CenterForQualityAssuranceDirectorService::sendAccountCreateMail($validatedDataWithFiles, $password);

            DB::commit();
            return new CenterForQualityAssuranceDirectorResource($cqaDirector);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'Failed to create CQA director account'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCenterForQualityAssuranceDirectorRequest $request, CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CenterForQualityAssuranceDirector $centerForQualityAssuranceDirector)
    {
        //
    }
}
