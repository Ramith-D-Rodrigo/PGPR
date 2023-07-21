<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\PostGraduateProgramReviewApplicationCollection;
use App\Models\PostGraduateProgramReviewApplication;
use App\Http\Requests\V1\StorePostGraduateProgramReviewApplicationRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramReviewApplicationRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramReviewApplicationResource;
use Illuminate\Support\Facades\Auth;
class PostGraduateProgramReviewApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return new PostGraduateProgramReviewApplicationCollection(PostGraduateProgramReviewApplication::paginate());
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
    public function store(StorePostGraduateProgramReviewApplicationRequest $request)
    {
        return new PostGraduateProgramReviewApplicationResource(PostGraduateProgramReviewApplication::create($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgramReviewApplication $pgprApplication)
    {
        return new PostGraduateProgramReviewApplicationResource($pgprApplication);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramReviewApplicationRequest $request, PostGraduateProgramReviewApplication $pgprApplication)
    {
        try{
            $pgprApplication->update($request->validated());
        }
        catch(\Exception $e){
            return response()->json(['message' => 'Error updating post graduate program review application.',
                'error' => $e->getMessage()]
            , 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgramReviewApplication $postGraduateProgramReviewApplication)
    {
        //
    }
}
