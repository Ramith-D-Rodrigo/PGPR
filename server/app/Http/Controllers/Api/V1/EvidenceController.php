<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\EvidenceResource;
use App\Models\Evidence;
use Illuminate\Http\Request;
use App\Http\Requests\V1\StoreEvidenceRequest;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

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
            //authorize the action
            $this->authorize('create', Evidence::class);


            $validatedData = $request->validated();
            //convert applicable years to json
            $validatedData['applicable_years'] = json_encode($validatedData['applicable_years']);

            DB::beginTransaction();

            $evidence = Evidence::create($validatedData);

            //insert to ser_evidence_standard table
            $evidence -> standards() -> attach($validatedData['standard_id'], [
                'ser_id' => $validatedData['self_evaluation_report_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Evidence created successfully',
                'data' => new EvidenceResource($evidence)
            ], 201);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Unable to create evidence',
                'error' => $e->getMessage()
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
    public function destroy(Evidence $evidence)
    {
        try{
            //authorize the action
            $this->authorize('forceDelete', $evidence);

            //remove the pivot record from ser_evidence_standard table
            $evidence -> standards() -> detach();

            $evidence->delete();

            return response()->json([
                'success' => true,
                'message' => 'Evidence deleted successfully',
                'data' => null
            ], 200);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 403);
        }
        catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Unable to delete evidence',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
