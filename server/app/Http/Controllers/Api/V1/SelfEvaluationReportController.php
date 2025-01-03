<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StoreAdherenceToSERStandard;
use App\Http\Requests\V1\SubmitSelfEvaluationReportRequest;
use App\Http\Resources\V1\SelfEvaluationReportResource;
use App\Http\Resources\V1\StandardCollection;
use App\Jobs\V1\CreatePGPRFolder;
use App\Jobs\V1\StoreEvidenceInDrive;
use App\Mail\InformSelfEvaluationReportActionToAuthorities;
use App\Models\Criteria;
use App\Models\DeskEvaluation;
use App\Models\SelfEvaluationReport;
use App\Http\Requests\V1\StoreSelfEvaluationReportRequest;
use App\Http\Requests\V1\UpdateSelfEvaluationReportRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\StandardResource;
use App\Jobs\V1\SetPermissionsForPGPRFolder;
use App\Models\Standard;
use App\Models\User;
use App\Services\V1\PostGraduateProgramReviewService;
use App\Services\V1\StandardService;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

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

        //authorize the request
        try{
            $this -> authorize('view', $selfEvaluationReport);
        }
        catch(AuthorizationException $e){
            return response() -> json([
                'message' => $e -> getMessage()
            ], 403);
        }

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

        $selfEvaluationReport->load([
            //call the whenLoaded method to load the relations only if they are loaded
            //load the following relations to get the needed details
            'postGraduateProgramReview:id,post_graduate_program_id,pgpr_application_id,status_of_pgpr' => [
                'postGraduateProgram:id,title,slqf_level,faculty_id,programme_coordinator_id,is_professional_pg_programme' => [
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
                'postGraduateProgramReviewApplication:id,application_date,request_date'
            ],
            'programmeCoordinator:id' => [
                'academicStaff:id' => [
                    'universitySide:id' => [
                        'user:id,initials,surname'
                    ]
                ]
            ],
            'standards' => function ($query) {
                $query->whereHas('evidences')->select('standards.id')
                    ->distinct() //only get the distinct standards (because a standard can have multiple evidences)
                    ->with([
                        'evidences:id,applicable_years',
                        'selfEvaluationReportAdherences'
                    ]);
            }
        ]);

        return new SelfEvaluationReportResource($selfEvaluationReport);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSelfEvaluationReportRequest $request, string $id)
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
        try{
            //authorize the request
            $this -> authorize('addAdherenceToStandardsAuthorize', $selfEvaluationReport);

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
        catch(AuthorizationException $e){
            return response() -> json([
                'message' => $e -> getMessage(),
            ], 403);
        }
        catch(Exception $e){
            return response() -> json([
                'message' => 'Failed to add adherence to standard',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //get the standards of the self evaluation report by the criteria id sent by client
    public function getStandards(SelfEvaluationReport $selfEvaluationReport, Criteria $criteria)
    {
        //we need to get the standards that are applicable to the self evaluation report
        $pgp = $selfEvaluationReport->postGraduateProgramReview->postGraduateProgram;
        $applicableStandards = StandardService::getApplicableStandards(
            $pgp->slqf_level,
            $pgp->is_professional_pg_programme,
            $criteria->id
        );


        //return the standard resources
        return new StandardCollection($applicableStandards);
    }

    //get the evidences and adherence of the standard
    public function getStandardEvidencesAndAdherence(SelfEvaluationReport $selfEvaluationReport, Standard $standard){
        try{
            //authorize the request
            $this -> authorize('getStandardEvidencesAndAdherenceAuthorize', $selfEvaluationReport);
            //get the evidences and adherence of the standard of the self evaluation report
            $standard->load([
                'evidences' => function ($query) use ($selfEvaluationReport, $standard) {
                    $query->whereHas('selfEvaluationReport', function ($query) use ($selfEvaluationReport, $standard) {
                        $query->where('ser_id', $selfEvaluationReport->id)->where('standard_id', $standard->id);
                    });
                },
                'selfEvaluationReportAdherences' => function ($query) use ($selfEvaluationReport, $standard) {
                    $query->where('ser_id', $selfEvaluationReport->id)->where('standard_id', $standard->id);
                }
            ]);
            //dd($standard);
            return new StandardResource($standard);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e -> getMessage(),
            ], 403);
        }
        catch(Exception $e){
            return response()->json([
                'message' => 'Error occurred while getting the standard evidences and adherence',
                'error' => $e->getTrace()
            ], 500);
        }
    }

    //submit the ser report for iqau, cqa, vc recommendations
    public function submitSelfEvaluationReport(SubmitSelfEvaluationReportRequest $request, SelfEvaluationReport $selfEvaluationReport){
        try{
            //authorize the request
            $this -> authorize('submitSelfEvaluationReportAuthorize', $selfEvaluationReport);

            //get the validated data
            $validatedData = $request->validated();

            //store the files in relevant folders
            $sectionA = $validatedData['section_a'];
            $sectionB = $validatedData['section_b'];
            $sectionD = $validatedData['section_d'];
            $paymentVoucher = $validatedData['payment_voucher'];
            $finalSER = $validatedData['final_ser_report'];

            //store section a in sectionA folder
            if (!File::exists(public_path('storage/ser/sectionA'))) {
                File::makeDirectory(public_path('storage/ser/sectionA'), $mode = 0777, true, true); //mode is 0777 by default
            }
            $sectionAFileName = $selfEvaluationReport->id . '_sectionA.' . $sectionA->getClientOriginalExtension();
            Storage::put('public/ser/sectionA/' . $sectionAFileName, $sectionA->getContent());

            //store section b in sectionB folder
            if (!File::exists(public_path('storage/ser/sectionB'))) {
                File::makeDirectory(public_path('storage/ser/sectionB'), $mode = 0777, true, true); //mode is 0777 by default
            }
            $sectionBFileName = $selfEvaluationReport->id . '_sectionB.' . $sectionB->getClientOriginalExtension();
            Storage::put('public/ser/sectionB/' . $sectionBFileName, $sectionB->getContent());

            //store section d in sectionD folder
            if (!File::exists(public_path('storage/ser/sectionD'))) {
                File::makeDirectory(public_path('storage/ser/sectionD'), $mode = 0777, true, true); //mode is 0777 by default
            }
            $sectionDFileName = $selfEvaluationReport->id . '_sectionD.' . $sectionD->getClientOriginalExtension();
            Storage::put('public/ser/sectionD/' . $sectionDFileName, $sectionD->getContent());

            //store payment voucher in paymentVoucher folder
            if (!File::exists(public_path('storage/ser/paymentVoucher'))) {
                File::makeDirectory(public_path('storage/ser/paymentVoucher'), $mode = 0777, true, true); //mode is 0777 by default
            }
            $paymentVoucherFileName = $selfEvaluationReport->id . '_paymentVoucher.' . $paymentVoucher->getClientOriginalExtension();
            Storage::put('public/ser/paymentVoucher/' . $paymentVoucherFileName, $paymentVoucher->getContent());

            //store final ser report in finalSER folder
            if (!File::exists(public_path('storage/ser/finalSER'))) {
                File::makeDirectory(public_path('storage/ser/finalSER'), $mode = 0777, true, true); //mode is 0777 by default
            }
            $finalSERFileName = $selfEvaluationReport->id . '_finalSER.' . $finalSER->getClientOriginalExtension();
            Storage::put('public/ser/finalSER/' . $finalSERFileName, $finalSER->getContent());

            //remove the current files if they are stored

            if($selfEvaluationReport -> section_a && Storage::exists(public_path($selfEvaluationReport -> section_a))){
                Storage::delete(Storage::url($selfEvaluationReport -> section_a));
            }

            if($selfEvaluationReport -> section_b && Storage::exists(public_path($selfEvaluationReport -> section_b))){
                Storage::delete(Storage::url($selfEvaluationReport -> section_b));
            }

            if($selfEvaluationReport -> sectioN_d && Storage::exists(public_path($selfEvaluationReport -> section_d))){
                Storage::delete(Storage::url($selfEvaluationReport -> section_d));
            }

            if($selfEvaluationReport -> final_ser_report && Storage::exists(public_path($selfEvaluationReport -> final_ser_report))){
                Storage::delete(Storage::url($selfEvaluationReport -> final_ser_report));
            }

            if($selfEvaluationReport -> postGraduateProgramReview -> payment_voucher && Storage::exists(public_path($selfEvaluationReport -> postGraduateProgramReview -> payment_voucher))){
                Storage::delete(Storage::url($selfEvaluationReport -> postGraduateProgramReview -> payment_voucher));
            }


            //get the paths
            $validatedData['section_a'] = Storage::url('public/ser/sectionA/' . $sectionAFileName);
            $validatedData['section_b'] = Storage::url('public/ser/sectionB/' . $sectionBFileName);
            $validatedData['section_d'] = Storage::url('public/ser/sectionD/' . $sectionDFileName);
            $validatedData['payment_voucher'] = Storage::url('public/ser/paymentVoucher/' . $paymentVoucherFileName);
            $validatedData['final_ser_report'] = Storage::url('public/ser/finalSER/' . $finalSERFileName);

            //update the self evaluation report
            DB::beginTransaction();
            $selfEvaluationReport->update([
                'section_a' => $validatedData['section_a'],
                'section_b' => $validatedData['section_b'],
                'section_d' => $validatedData['section_d'],
                'final_ser_report' => $validatedData['final_ser_report'],
                'updated_at' => now(),
            ]);

            //update the payment voucher in postgraduate programme review
            $selfEvaluationReport->postGraduateProgramReview->update([
                'payment_voucher' => $validatedData['payment_voucher'],
                'updated_at' => now(),
            ]);

            // TODO: VICE CHANCELLOR, CQA DIR
            $postGraduateProgramReview = $selfEvaluationReport->postGraduateProgramReview;
            $postGraduateProgram = $postGraduateProgramReview->postGraduateProgram;
            $viceChancellor = $postGraduateProgram->faculty->university->viceChancellor->universitySide->user;
            $cqaDirector = $postGraduateProgram->faculty->university->centerForQualityAssurance->currentQualityAssuranceDirector->qualityAssuranceStaff->universitySide->user;
            $university = $postGraduateProgram->faculty->university;
            $faculty = $postGraduateProgram->faculty;

            Mail::to($viceChancellor->official_email)->send(
                new InformSelfEvaluationReportActionToAuthorities(
                    user:$viceChancellor,
                    action: 'SUBMITTING_SER_FOR_IQAU_CQA_VC_RECOMMENDATIONS',
                    university: $university,
                    faculty: $faculty,
                    postGraduateProgram: $postGraduateProgram,
                    selfEvaluationReport: $selfEvaluationReport,
                    subject: 'Self evaluation report was submitted for recommendation',
                    content: 'mail.informSelfEvaluationReportActionToAuthorities'
                )
            );

            Mail::to($cqaDirector->official_email)->send(
                new InformSelfEvaluationReportActionToAuthorities(
                    user:$cqaDirector,
                    action: 'SUBMITTING_SER_FOR_IQAU_CQA_VC_RECOMMENDATIONS',
                    university: $university,
                    faculty: $faculty,
                    postGraduateProgram: $postGraduateProgram,
                    selfEvaluationReport: $selfEvaluationReport,
                    subject: 'Self evaluation report was submitted for recommendation',
                    content: 'mail.informSelfEvaluationReportActionToAuthorities'
                )
            );

            DB::commit();

            return response()->json([
                'message' => 'Self evaluation report submitted successfully',
                'self_evaluation_report' => new SelfEvaluationReportResource($selfEvaluationReport)
            ], 200);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e -> getMessage(),
            ], 403);
        }
        catch(Exception $e){
            DB::rollBack();
            //delete the files if they are stored
            if (Storage::exists('public/ser/sectionA/' . $sectionAFileName)) {
                Storage::delete('public/ser/sectionA/' . $sectionAFileName);
            }
            if (Storage::exists('public/ser/sectionB/' . $sectionBFileName)) {
                Storage::delete('public/ser/sectionB/' . $sectionBFileName);
            }
            if (Storage::exists('public/ser/sectionD/' . $sectionDFileName)) {
                Storage::delete('public/ser/sectionD/' . $sectionDFileName);
            }
            if (Storage::exists('public/ser/paymentVoucher/' . $paymentVoucherFileName)) {
                Storage::delete('public/ser/paymentVoucher/' . $paymentVoucherFileName);
            }
            if (Storage::exists('public/ser/finalSER/' . $finalSERFileName)) {
                Storage::delete('public/ser/finalSER/' . $finalSERFileName);
            }

            return response()->json([
                'message' => 'Error occurred while submitting the self evaluation report',
                'error' => $e->getTrace()
            ], 500);
        }
    }

    public function recommendSelfEvaluationReport(SelfEvaluationReport $selfEvaluationReport){
        try{
            //authorize the request
            $this -> authorize('recommendSelfEvaluationReportAuthorize', $selfEvaluationReport);

            //first check if the self evaluation report is submitted
            //checked using section_a, section_b, section_d, final_ser_report and payment_voucher
            if (
                $selfEvaluationReport->section_a === null ||
                $selfEvaluationReport->section_b === null ||
                $selfEvaluationReport->section_d === null ||
                $selfEvaluationReport->final_ser_report === null ||
                $selfEvaluationReport->postGraduateProgramReview->payment_voucher === null
            ) {
                return response()->json([
                    'message' => 'Self evaluation report is not submitted yet'
                ], 400);
            }

            //check if the self evaluation report is already recommended
            if ($selfEvaluationReport->postGraduateProgramReview->status_of_pgpr !== 'PLANNING') {
                //only in planning stage, self evaluation report can be recommended
                return response()->json([
                    'message' => 'Cannot recommend Self Evaluation Report at this stage'
                ], 400);
            }

            //get the requesting user role
            $userRole = request()->session()->get('authRole');

            //role should be either cqa_director or vice_chancellor
            DB::beginTransaction();
            $postGraduateProgramReview = $selfEvaluationReport->postGraduateProgramReview;
            $postGraduateProgram = $postGraduateProgramReview->postGraduateProgram;
            $viceChancellor = $postGraduateProgram->faculty->university->viceChancellor->universitySide->user;
            $cqaDirector = $postGraduateProgram->faculty->university->centerForQualityAssurance->currentQualityAssuranceDirector->qualityAssuranceStaff->universitySide->user;
            $university = $postGraduateProgram->faculty->university;
            $faculty = $postGraduateProgram->faculty;
            $iqauDirector = $faculty -> internalQualityAssuranceUnit -> internalQualityAssuranceUnitDirector -> qualityAssuranceStaff -> universitySide -> user;
            $programCoordinator = $postGraduateProgram -> currentProgrammeCoordinator -> academicStaff -> universitySide -> user;
            $qacDirector = User::whereJsonContains('roles', 'qac_director')->first();

            // TODO: INFORM PROGRAMME CO, IQAU
            Mail::to($iqauDirector->official_email)->send(
                new InformSelfEvaluationReportActionToAuthorities(
                    user:$iqauDirector,
                    action: 'RECOMMEND_SELFEVALUATION_REPORT',
                    university: $university,
                    faculty: $faculty,
                    postGraduateProgram: $postGraduateProgram,
                    selfEvaluationReport: $selfEvaluationReport,
                    subject: 'A self evaluation report was recommended',
                    content: 'mail.informSelfEvaluationReportActionToAuthorities'
                )
            );

            Mail::to($programCoordinator->official_email)->send(
                new InformSelfEvaluationReportActionToAuthorities(
                    user:$programCoordinator,
                    action: 'RECOMMEND_SELFEVALUATION_REPORT',
                    university: $university,
                    faculty: $faculty,
                    postGraduateProgram: $postGraduateProgram,
                    selfEvaluationReport: $selfEvaluationReport,
                    subject: 'A self evaluation report was recommended',
                    content: 'mail.informSelfEvaluationReportActionToAuthorities'
                )
            );


            if ($userRole === 'cqa_director') {
                //we have to update center_for_quality_assurance_director_id in self evaluation report
                $selfEvaluationReport->update([
                    'center_for_quality_assurance_director_id' => request()->user()->id,
                    'updated_at' => now(),
                ]);
                // TODO: INFORM VICE CHANCELLOR
                Mail::to($viceChancellor->official_email)->send(
                    new InformSelfEvaluationReportActionToAuthorities(
                        user:$viceChancellor,
                        action: 'RECOMMEND_SELFEVALUATION_REPORT',
                        university: $university,
                        faculty: $faculty,
                        postGraduateProgram: $postGraduateProgram,
                        selfEvaluationReport: $selfEvaluationReport,
                        subject: 'A self evaluation report was recommended',
                        content: 'mail.informSelfEvaluationReportActionToAuthorities'
                    )
                );
            } else if ($userRole === 'vice_chancellor') {
                //we have to update vice_chancellor_id in self evaluation report
                $selfEvaluationReport->update([
                    'vice_chancellor_id' => request()->user()->id,
                    'updated_at' => now(),
                ]);
                // TODO: INFORM CQA DIR
                Mail::to($cqaDirector->official_email)->send(
                new InformSelfEvaluationReportActionToAuthorities(
                    user:$cqaDirector,
                    action: 'RECOMMEND_SELFEVALUATION_REPORT',
                    university: $university,
                    faculty: $faculty,
                    postGraduateProgram: $postGraduateProgram,
                    selfEvaluationReport: $selfEvaluationReport,
                    subject: 'A self evaluation report was recommended',
                    content: 'mail.informSelfEvaluationReportActionToAuthorities'
                )
            );
            } else {
                return response()->json([
                    'message' => 'You are not authorized to recommend the self evaluation report',
                ], 403);
            }

            //check whether all the three roles have recommended the self evaluation report
            if ($selfEvaluationReport->center_for_quality_assurance_director_id !== null && $selfEvaluationReport->vice_chancellor_id !== null) {
                //update the status of the postgraduate programme review
                $selfEvaluationReport->postGraduateProgramReview->update([
                    'status_of_pgpr' => 'SUBMITTED',
                    'updated_at' => now(),
                ]);

                // TODO: INFORM THE QAC DIRECTOR ABOUT THE SUBMISSION OF THE SER
                Mail::to($qacDirector->official_email)->send(
                    new InformSelfEvaluationReportActionToAuthorities(
                        user:$qacDirector,
                        action: 'RECOMMEND_SELFEVALUATION_REPORT',
                        university: $university,
                        faculty: $faculty,
                        postGraduateProgram: $postGraduateProgram,
                        selfEvaluationReport: $selfEvaluationReport,
                        subject: 'A self evaluation report was recommended',
                        content: 'mail.informSelfEvaluationReportActionToAuthorities'
                    )
                );

                //check if reviewer team has been assigned to the postgraduate programme review
                $pgpr = $selfEvaluationReport -> postGraduateProgramReview;
                $reviewTeam = $pgpr -> acceptedReviewTeam;

                if($reviewTeam && $pgpr -> hasAllReviewersAccepted()){   //has an accepted review team
                    //store the files in relevant folders by dispatching jobs
                    PostGraduateProgramReviewService::StoreEvidencesInSystemDriveAggregateJob($pgpr);

                    //create the desk evaluation now (since the self evaluation report is submitted and there is an accepted review team)

                    //after storing, we can create the desk evaluation
                    $deskEvaluation = new DeskEvaluation();
                    $deskEvaluation->pgpr_id = $reviewTeam->pgpr_id;
                    $deskEvaluation->start_date = NULL; // or to set this is current time use => Carbon::now()
                    $deskEvaluation->end_date = NULL;
                    $deskEvaluation->save();

                    //change the status of the postgraduate programme review to 'DE'
                    $pgpr->update([
                        'status_of_pgpr' => 'DE',
                        'updated_at' => now(),
                    ]);

                    // TODO: INFORM THE REVIEW TEAM THAT THE DE HAS STARTED
                    $reviewers = $postGraduateProgramReview->reviewTeam->reviewers;

                    foreach ($reviewers as $reviewer) {
                        Mail::to($reviewer->user->official_email)->send(
                            new InformSelfEvaluationReportActionToAuthorities(
                                user:$reviewer->user,
                                action: 'RECOMMEND_SELFEVALUATION_REPORT',
                                university: $university,
                                faculty: $faculty,
                                postGraduateProgram: $postGraduateProgram,
                                selfEvaluationReport: $selfEvaluationReport,
                                subject: 'The desk evaluation process has begun for a request',
                                content: 'mail.informSelfEvaluationReportActionToAuthorities'
                            )
                        );
                    }

                    DB::commit();

                    return response()->json([
                        'message' => 'Self evaluation report recommended successfully',
                    ], 200);
                }
                else{
                    DB::commit();
                    //if no review team is assigned to the postgraduate programme review
                    return response()->json([
                        'message' => 'Self evaluation report recommended successfully. But no review team is assigned to the postgraduate programme review',
                    ], 200);
                }
            }
            else{
                //commit the transaction of recommending the self evaluation report
                DB::commit();

                return response()->json([
                    'message' => 'Self evaluation report recommended successfully',
                ], 200);
            }
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e -> getMessage(),
            ], 403);
        }
        catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => 'Error occurred while recommending the self evaluation report',
                'error' => $e -> getTrace(),
                'errorMessage' => $e -> getMessage(),
                'errorLine' => $e -> getLine(),
            ], 500);
        }
    }
}
