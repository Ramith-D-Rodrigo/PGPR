<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StoreAdherenceToSERStandard;
use App\Http\Resources\V1\SelfEvaluationReportResource;
use App\Http\Resources\V1\StandardCollection;
use App\Models\Criteria;
use App\Models\SelfEvaluationReport;
use App\Http\Requests\V1\StoreSelfEvaluationReportRequest;
use App\Http\Requests\V1\UpdateSelfEvaluationReportRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\StandardResource;
use App\Models\Standard;
use App\Services\V1\StandardService;
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
            'standards' => function($query){
                $query -> whereHas('selfEvaluationReportAdherences')
                -> whereHas('evidences') -> select('standards.id')
                -> distinct() //only get the distinct standards (because a standard can have multiple evidences)
                -> with([
                    'evidences:id,applicable_years',
                    'selfEvaluationReportAdherences'
                ]);
            }
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

    //get the standards of the self evaluation report by the criteria id sent by client
    public function getStandards(SelfEvaluationReport $selfEvaluationReport, Criteria $criteria){
        //we need to get the standards that are applicable to the self evaluation report
        $pgp = $selfEvaluationReport -> postGraduateProgramReview -> postGraduateProgram;
        $applicableStandards = StandardService::getApplicableStandards(
            $pgp -> slqf_level,
            $pgp -> is_professional_pg_programme,
            $criteria -> id);


        //return the standard resources
        return new StandardCollection($applicableStandards);
    }

    //get the evidences and adherence of the standard
    public function getStandardEvidencesAndAdherence(SelfEvaluationReport $selfEvaluationReport, Standard $standard){
        try{
            //get the evidences and adherence of the standard of the self evaluation report
            $standard -> load([
                'evidences' => function($query) use ($selfEvaluationReport, $standard){
                    $query -> whereHas('selfEvaluationReport', function($query) use ($selfEvaluationReport, $standard){
                        $query -> where('ser_id', $selfEvaluationReport -> id) -> where('standard_id', $standard -> id);
                    });
                },
                'selfEvaluationReportAdherences' => function($query) use ($selfEvaluationReport, $standard){
                    $query -> where('ser_id', $selfEvaluationReport -> id) -> where('standard_id', $standard -> id);
                }
            ]);
            //dd($standard);
            return new StandardResource($standard);
        }
        catch(Exception $e){
            return response()->json([
                'message' => 'Error occurred while getting the standard evidences and adherence',
                'error' => $e -> getTrace()
            ], 500);
        }
    }
}
