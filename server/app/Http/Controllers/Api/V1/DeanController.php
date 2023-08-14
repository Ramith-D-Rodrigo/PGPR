<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\DeanFilter;
use App\Http\Resources\V1\DeanCollection;
use App\Http\Resources\V1\DeanResource;
use App\Models\Dean;
use App\Http\Requests\V1\StoreDeanRequest;
use App\Http\Requests\V1\UpdateDeanRequest;
use App\Http\Controllers\Controller;
use App\Mail\sendPassword;
use App\Models\Faculty;
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
        try{
            $filter = new DeanFilter(request() -> session() -> get('authRole'), request());

            $queryItems = $filter -> getEloQuery();

            $deans = Dean::where($queryItems);

            //related data

            $academicStaff = request() -> query('includeAcademicStaff');
            if($academicStaff){
                $deans = $deans -> with('academicStaff');

                $uniSide = request() -> query('includeUniversitySide');

                if($uniSide){
                    $deans = $deans -> with(['academicStaff' => ['universitySide']]);

                    $user = request() -> query('includeUser');

                    if($user){
                        $deans = $deans -> with(['academicStaff' => ['universitySide' => ['user']]]);
                    }
                }
            }

            $faculty = request() -> query('includeFaculty');

            if($faculty){
                $deans = $deans -> with('faculty');
            }

            return new DeanCollection($deans -> paginate() -> appends(request() -> query()));
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
    public function store(StoreDeanRequest $request)
    {
        //set needed additional fields

        $validatedData = $request -> validated(); //get the validated data

        $validatedData['status'] = 'Pending'; //set the status (user account status)
        $validatedData['current_status'] = 'Active';   //set the current status (dean status)
        $validatedData['roles'] = ['dean']; //set the roles (dean role)


        $password = Str::random(8);  //generate a random password
        //hash the password using Hash facade

        $validatedData['password'] = Hash::make($password); //set the password

        try{
            DB::beginTransaction();

            //store the files
            $validatedData = DeanService::storeFiles($validatedData);

            $dean = DeanService::create($validatedData);

            //update the faculty dean id
            $faculty = Faculty::findOrFail($validatedData['faculty_id']);

            $faculty -> update([
                'dean_id' => $dean -> id
            ]);

            //send the email
            DeanService::sendAccountCreateMail($validatedData, $password);
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
        try{
            //include related data
            $academicStaff = request() -> query('includeAcademicStaff');

            if($academicStaff){
                $uniSide = request() -> query('includeUniversitySide');

                if($uniSide){
                    $user = request() -> query('includeUser');

                    if($user){
                        $dean = $dean -> load(['academicStaff' => ['universitySide' => ['user']]]);
                    }
                    else{
                        $dean = $dean -> load(['academicStaff' => ['universitySide']]);
                    }
                }
                else{
                    $dean = $dean -> loadMissing('academicStaff');
                }
            }

            $faculty = request() -> query('includeFaculty');

            if($faculty){
                $dean = $dean -> loadMissing('faculty');
            }

            return new DeanResource($dean);
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
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
