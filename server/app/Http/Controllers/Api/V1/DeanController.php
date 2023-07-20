<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\DeanResource;
use App\Models\Dean;
use App\Http\Requests\V1\StoreDeanRequest;
use App\Http\Requests\V1\UpdateDeanRequest;
use App\Http\Controllers\Controller;
use App\Mail\sendPassword;
use App\Services\V1\DeanService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class DeanController extends Controller
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
    public function store(StoreDeanRequest $request)
    {
        //set needed additional fields

        $validatedData = $request -> validated(); //get the validated data

        $validatedData['status'] = 'Pending'; //set the status (user account status)
        $validatedData['current_status'] = 'Active';   //set the current status (dean status)
        $validatedData['staff_position'] = 'academic'; //set the staff position
        $validatedData['roles'] = ['dean']; //set the roles (dean role)


        $password = Str::random(8);  //generate a random password
        //hash the password using Hash facade

        $validatedData['password'] = Hash::make($password); //set the password

        try{
            DB::beginTransaction();

            $dean = DeanService::create($validatedData);

            //send email to the dean
            $user = [
                'surname' => $validatedData['surname'],
                'initials' => $validatedData['initials'],
                'password' => $password,
                'roles' => $validatedData['roles'],
                'official_email' => $validatedData['official_email'],
            ];

            Mail::to($validatedData['official_email']) -> send(new sendPassword($user, 'Created Account for Postgraduate Programme Review System', 'mail.userAccountPassword'));
            DB::commit();   //commit the changes if all of them were successful
            return new DeanResource($dean);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response() -> json(['message' => 'Failed to create dean', 'error' => $e -> getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Dean $dean)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dean $dean)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeanRequest $request, Dean $dean)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dean $dean)
    {
        //
    }
}
