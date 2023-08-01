<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StoreAdherenceToSERStandard;
use App\Http\Resources\V1\SelfEvaluationReportResource;
use App\Models\SelfEvaluationReport;
use App\Http\Requests\V1\StoreSelfEvaluationReportRequest;
use App\Http\Requests\V1\UpdateSelfEvaluationReportRequest;
use App\Http\Controllers\Controller;
use Exception;
use Symfony\Component\HttpFoundation\Request;

class SelfEvaluationReportController extends Controller
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
    public function store(StoreSelfEvaluationReportRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SelfEvaluationReport $selfEvaluationReport)
    {
        //needed details
        //university name and faculty name
        //pgpr id
        //pgp name
        //pgpr application date
        //pgp slqf level
        //pg coodinator name
        //criterias
        //submitted standards count
        //evidence count for each applicable year of criteria

        $selfEvaluationReport -> load([
            //call the whenLoaded method to load the relations only if they are loaded
            //load the following relations to get the needed details
            'postGraduateProgramReview:id,post_graduate_program_id,pgpr_application_id' => [
                'postGraduateProgram:id,title,slqf_level,faculty_id,programme_coordinator_id' => [
                    'faculty:id,name,university_id' => [
                        'university:id,name',
                    ],
                    'currentProgrammeCoordinator:id' => [
                        'academicStaff:id' => [
                            'universitySide:id' => [
                                'user:id,initials,surname'
                            ]
                        ]
                    ],
                ],
                'postGraduateProgramReviewApplication:id,application_date'
            ],
            'adherenceToStandards:id' => [
                'evidences:id,applicable_years'
            ]
        ]);

        return new SelfEvaluationReportResource($selfEvaluationReport);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSelfEvaluationReportRequest $request, SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SelfEvaluationReport $selfEvaluationReport)
    {
        //
    }

    //add adherence to standards
    public function addAdherenceToStandards(StoreAdherenceToSERStandard $request, SelfEvaluationReport $selfEvaluationReport)
    {
        $validatedData = $request->validated();

        //check whether the adherence to standard already exists
        $standard = $selfEvaluationReport->adherenceToStandards()->where('standard_id', $validatedData['standard_id'])->first();
        if($standard){
            //then update the adherence
            $selfEvaluationReport -> adherenceToStandards() -> updateExistingPivot($validatedData['standard_id'], [
                'adherence' => $validatedData['adherence'],
                'updated_at' => now(),
            ]);
        }
        else{
            $selfEvaluationReport -> adherenceToStandards() -> attach($validatedData['standard_id'], [
                'adherence' => $validatedData['adherence'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Adherence to standard added successfully',
        ], 201);
    }
}
