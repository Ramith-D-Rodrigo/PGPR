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
use Illuminate\Support\Facades\Mail;

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
        try{
            DB::beginTransaction();
            //set needed additional fields
            $request -> setAttribute('status', 'Pending'); //set the status (user account status)
            $request -> setAttribute('current_status', 'Active'); //set the current status (dean status)
            $request -> setAttribute('staff_position', 'Dean'); //set the staff position
            $request -> setAttribute('roles', ['dean']); //set the roles (dean role)

            $dean = DeanService::create($request -> validated());

            //send email to the dean
            $user = [
                'surname' => $request -> getAttribute('surname'),
                'initials' => $request -> getAttribute('initials'),
                'password' => $request -> getAttribute('password'),
                'roles' => $request -> getAttribute('roles'),
                'official_email' => $request -> getAttribute('official_email'),
            ];

            Mail::to($request -> getAttribute('official_email')) -> send(new sendPassword($user, 'Created Account for Postgraduate Programme Review System', 'mail.userAccountPassword'));
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
