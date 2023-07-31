<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\EvidenceResource;
use App\Models\Evidence;
use Illuminate\Http\Request;
use App\Http\Requests\V1\StoreEvidenceRequest;

class EvidenceController extends Controller
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
    public function store(StoreEvidenceRequest $request)
    {
        try{
            $validatedData = $request->validated();
            //convert applicable years to json
            $validatedData['applicable_years'] = json_encode($validatedData['applicable_years']);

            $resource = new EvidenceResource(Evidence::create($validatedData));
            
            return response()->json([
                'success' => true,
                'message' => 'Evidence created successfully',
                'data' => $resource
            ], 201);
        }
        catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Unable to create evidence',
                'data' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
