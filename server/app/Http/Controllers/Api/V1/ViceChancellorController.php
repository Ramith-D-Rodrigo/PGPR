<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\ViceChancellorResource;
use App\Models\ViceChancellor;
use App\Http\Requests\V1\StoreViceChancellorRequest;
use App\Http\Requests\V1\UpdateViceChancellorRequest;
use App\Http\Controllers\Controller;
use App\Services\V1\ViceChancellorService;
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
        $validatedData = $request->validated();

        //insert additional data to validated data
        $validatedData['status'] = 'pending';
        $validatedData['staff_position'] = 'vc';
        $validatedData['roles'] = ['vice_chancellor'];
        $validatedData['vc_status'] = 'ACTIVE';
        //term date is appointed date + 5 years
        $validatedData['term_date'] = date('Y-m-d', strtotime('+5 years', strtotime($validatedData['appointed_date'])));

        //create a random password
        $password = Str::random(8);

        //hash the password
        $validatedData['password'] = Hash::make($password);

        try{
            DB::beginTransaction();

            //store the files( profile picture)
            $validatedData = ViceChancellorService::storeFiles($validatedData);

            $viceChancellor = ViceChancellorService::create($validatedData);

            //send mail
            ViceChancellorService::sendAccountCreateMail($validatedData, $password);
            DB::commit();
            return new ViceChancellorResource($viceChancellor);
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
}