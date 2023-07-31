<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\PostGraduateProgramReviewApplicationCollection;
use App\Models\PostGraduateProgramReview;
use App\Models\PostGraduateProgramReviewApplication;
use App\Http\Requests\V1\StorePostGraduateProgramReviewApplicationRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramReviewApplicationRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramReviewApplicationResource;
use App\Models\SelfEvaluationReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
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
            $validatedData = $request -> validated();

            //store the intent letter if it is included in the request
            if($request -> intent_letter){
                $intentLetter = $request -> intent_letter;
                $ext = $intentLetter->getClientOriginalExtension();

                //create the intent letter directory if it does not exist
                if(!File::exists(public_path('storage/intent_letters'))){
                    File::makeDirectory(public_path('storage/intent_letters'));
                }

                $intentLetterName = "il" . time() . '.' . $ext;
                Storage::put('public/intent_letters/' . $intentLetterName, $intentLetter->getContent());

                //get the intent letter url
                $intentLetterUrl = Storage::url('public/intent_letters/' . $intentLetterName);
                $validatedData['intent_letter'] = $intentLetterUrl;

                //delete the old intent letter
                if($pgprApplication -> intent_letter){
                    $oldIntentLetter = $pgprApplication -> intent_letter; //get the old intent letter path
                    $oldIntentLetterPath = str_replace('/storage', 'public', $oldIntentLetter); //replace the url with server path
                    Storage::delete($oldIntentLetterPath);
                }
            }

            //update the model
            $pgprApplication -> update($validatedData);
        }
        catch(\Exception $e){
            return response()->json(['message' => 'Error updating post graduate program review application.',
                'error' => $e->getMessage()]
            , 400);
        }
    }

    //submit the post graduate program review application to the cqa director approval
    public function submit(Request $request, PostGraduateProgramReviewApplication $pgprApplication){
        try{
            //check submitting user is the dean of the faculty
            $dean = Auth::user();
            $deanFacultyID = $dean -> universitySide -> academicStaff -> dean -> faculty -> id ?? null;
            if($deanFacultyID != $pgprApplication -> postGraduatePrograms -> faculty_id){
                return response()->json(['message' => 'You are not authorized to submit this post graduate program review application.'], 403);
            }

            //check whether intent letter is uploaded
            if(!$pgprApplication -> intent_letter){
                return response()->json(['message' => 'Intent letter is not uploaded.'], 400);
            }

            //check whether the application is already submitted
            if($pgprApplication -> request_date || $pgprApplication -> status == 'submitted'){
                return response()->json(['message' => 'This post graduate program review application is already submitted.'], 400);
            }


            $pgprApplication -> update(['request_date' => today() -> toDateString()]);
        }
        catch(\Exception $e){
            return response()->json(['message' => 'Error submitting post graduate program review application.',
                'error' => $e->getMessage()]
            , 400);
        }
    }

    //cqa director recommendation
    public function cqaDirectorRecommendation(Request $request, PostGraduateProgramReviewApplication $pgprApplication){
        try{
            //check submitting user is the cqa director
            $cqaDirector = Auth::user();
            $cqaDirectorID = $cqaDirector -> universitySide -> qualityAssuranceStaff -> centerForQualityAssuranceDirector -> id ?? null;
            if($cqaDirectorID != $pgprApplication -> postGraduatePrograms -> faculty -> university -> cqa_director_id){
                return response()->json(['message' => 'You are not authorized to approve this post graduate program review application.'], 403);
            }

            //check whether the application is already approved
            if($pgprApplication -> application_date){
                return response()->json(['message' => 'This post graduate program review application is already approved.'], 400);
            }

            $pgprApplication -> update(['application_date' => today() -> toDateString()]);
        }
        catch(\Exception $e){
            return response()->json(['message' => 'Error approving post graduate program review application.',
                'error' => $e->getMessage()]
            , 400);
        }
    }

    //qac officer approval
    public function qacOfficerApproval(Request $request, PostGraduateProgramReviewApplication $pgprApplication){
        try{
            //check submitting user is the qac officer
            $qacOfficer = Auth::user();
            $qacOfficerID = $qacOfficer -> qualityAssuranceCouncilOfficer -> id ?? null;

            //not a qac officer
            if(!$qacOfficerID){
                return response()->json(['message' => 'You are not authorized to approve this post graduate program review application.'], 403);
            }

            //check whether the application is already approved
            if($pgprApplication -> quality_assurance_council_officer_id  && ($pgprApplication -> status == 'approved' || $pgprApplication -> status == 'rejected')){
                return response()->json(['message' => 'This post graduate program review application is already handled.'], 400);
            }

            DB::beginTransaction();

            $pgprApplication -> update(['quality_assurance_council_officer_id' => $qacOfficerID, 'status' => $request -> status]);

            //create a post graduate program review if the application is approved
            if($request -> status == 'approved'){
                //after approving, create a post graduate program review
                $pgpr = PostGraduateProgramReview::create([
                    'post_graduate_program_id' => $pgprApplication -> post_graduate_program_id,
                    'pgpr_application_id' => $pgprApplication -> id
                ]);

                //now create self evaluation report for the pgpr
                $ser = SelfEvaluationReport::create([
                    'post_graduate_program_review_id' => $pgpr -> id,
                    'pgp_coordinator_id' => $pgpr -> postGraduateProgram -> currentProgrammeCoordinator -> id //get the current pgp coordinator
                ]);
            }
            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'Error approving/rejecting post graduate program review application.',
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
