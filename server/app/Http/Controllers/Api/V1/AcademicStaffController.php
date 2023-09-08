<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\AcademicStaffResource;
use App\Models\AcademicStaff;
use App\Http\Requests\StoreAcademicStaffRequest;
use App\Http\Requests\UpdateAcademicStaffRequest;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;

class AcademicStaffController extends Controller
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
    public function store(StoreAcademicStaffRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicStaff $academicStaff)
    {
        try{
            return new AcademicStaffResource($academicStaff);
        }
        catch(\Exception $e){
            return response()->json([
                'message' => 'Academic Staff not found.'
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicStaff $academicStaff)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicStaffRequest $request, AcademicStaff $academicStaff)
    {
        try{
            $this -> authorize('update', [$request, $academicStaff]);

            $academicStaff -> update($request -> validated());

            return response() -> json([
                'message' => 'Academic Staff profile updated successfully.',
            ], 200);
        }
        catch(AuthorizationException $e){
            return response() -> json([
                'message' => $e -> getMessage(),
            ], 403);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Error updating Academic Staff profile.',
                'error' => $e -> getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicStaff $academicStaff)
    {
        //
    }
}
