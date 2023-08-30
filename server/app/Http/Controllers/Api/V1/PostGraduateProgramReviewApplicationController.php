<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\PostGraduateProgramReviewApplicationFilter;
use App\Http\Resources\V1\PostGraduateProgramReviewApplicationCollection;
use App\Models\PostGraduateProgramReview;
use App\Models\PostGraduateProgramReviewApplication;
use App\Http\Requests\V1\StorePostGraduateProgramReviewApplicationRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramReviewApplicationRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostGraduateProgramReviewApplicationResource;
use App\Models\SelfEvaluationReport;
use Illuminate\Auth\Access\AuthorizationException;
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
        try{
            //authorize the action
            $this -> authorize('viewAny', PostGraduateProgramReviewApplication::class);

            $filter = new PostGraduateProgramReviewApplicationFilter(request() -> session() -> get('authRole'), request());

            $queryItems = $filter -> getEloQuery();
            $whereInQueryItems = $filter -> getWhereInQuery();
            $whereNotInQueryItems = $filter -> getWhereNotInQuery();

            $pgprApplications = PostGraduateProgramReviewApplication::where($queryItems);

            foreach($whereInQueryItems as $whereInQueryItem){
                $pgprApplications = $pgprApplications -> whereIn($whereInQueryItem[0], $whereInQueryItem[1]);
            }

            foreach($whereNotInQueryItems as $whereNotInQueryItem){
                $pgprApplications = $pgprApplications -> whereNotIn($whereNotInQueryItem[0], $whereNotInQueryItem[1]);
            }


            //related data
            $pgpr = request() -> query('includePostGraduateProgram');

            if($pgpr){
                $pgprApplications = $pgprApplications -> with('postGraduateProgram:id,title');

                //faculty
                $faculty = request() -> query('includeFaculty');

                if($faculty){
                    $pgprApplications = $pgprApplications -> with(['postGraduateProgram:id,title,faculty_id' => [
                        'faculty:id,name'
                    ]]);

                    //university
                    $university = request() -> query('includeUniversity');

                    if($university){
                        $pgprApplications = $pgprApplications -> with(['postGraduateProgram:id,title,faculty_id' => [
                            'faculty:id,name,university_id' => [
                                'university:id,name'
                            ]
                        ]]);
                    }
                }
            }

            return new PostGraduateProgramReviewApplicationCollection($pgprApplications -> get());
        }
        catch(AuthorizationException $e){
            return response() -> json(['message' => $e -> getMessage()], 403);
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostGraduateProgramReviewApplicationRequest $request)
    {
        try{
            //authorize the action
            $this -> authorize('create', PostGraduateProgramReviewApplication::class);

            return new PostGraduateProgramReviewApplicationResource(
                PostGraduateProgramReviewApplication::create($request->validated())
            );
        }
        catch(AuthorizationException $e){
            return response() -> json(['message' => $e -> getMessage()], 403);
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgramReviewApplication $pgprApplication)
    {
        try{
            //authorize action
            $this -> authorize('view', $pgprApplication);

            //include the related data
            $pgpr = request() -> query('includePostGraduateProgram');

            if($pgpr){
                //faculty
                $faculty = request() -> query('includeFaculty');

                if($faculty){
                    //university
                    $university = request() -> query('includeUniversity');

                    if($university){
                        $pgprApplication = $pgprApplication -> load(['postGraduateProgram:id,title,faculty_id' => [
                            'faculty:id,name,university_id' => [
                                'university:id,name'
                            ]
                        ]]);
                    }
                    else{
                        $pgprApplication = $pgprApplication -> load(['postGraduateProgram:id,title,faculty_id' => [
                            'faculty:id,name'
                        ]]);
                    }
                }
                else{
                    $pgprApplication = $pgprApplication -> loadMissing('postGraduateProgram:id,title');
                }
            }

            return new PostGraduateProgramReviewApplicationResource($pgprApplication);
        }
        catch(AuthorizationException $e){
            return response() -> json(['message' => $e -> getMessage()], 403);
        }
        catch(\Exception $e){
            return response() -> json(['message' => $e -> getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramReviewApplicationRequest $request, PostGraduateProgramReviewApplication $pgprApplication)
    {
        try{
            //authorize the action
            $this -> authorize('update', $pgprApplication);

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

            return response()->json(['message' => 'Post graduate program review application updated successfully.'], 200);
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e -> getMessage()], 403);
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
            //authorize submission
            $this -> authorize('submitAuthorize', $pgprApplication);

            //check whether intent letter is uploaded
            if(!$pgprApplication -> intent_letter){
                return response()->json(['message' => 'Intent letter is not uploaded.'], 400);
            }

            $pgprApplication -> update(['request_date' => today() -> toDateString(), 'status' => 'submitted']);

            return response()->json(['message' => 'Post graduate program review application submitted successfully.'], 200);
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e -> getMessage()], 403);
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
            //authorize the cqa director
            $this -> authorize('cqaDirectorRecommendationAuthorize', $pgprApplication);

            $pgprApplication -> update(['application_date' => today() -> toDateString(), 'status' => 'applied']);

            return response()->json(['message' => 'Post graduate program review application recommended successfully.'], 200);
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e -> getMessage()], 403);
        }
        catch(\Exception $e){
            return response()->json(['message' => 'Error recommending post graduate program review application.',
                'error' => $e->getMessage()]
            , 400);
        }
    }

    //qac officer approval
    public function qacOfficerApproval(Request $request, PostGraduateProgramReviewApplication $pgprApplication){
        try{
            //authorize the qac officer
            $this -> authorize('qacOfficerApprovalAuthorize', $pgprApplication);

            if($request -> status != 'approved' && $request -> status != 'rejected'){
                return response()->json(['message' => 'Invalid status.'], 400);
            }

            DB::beginTransaction();

            $pgprApplication -> update(['quality_assurance_council_officer_id' => Auth::user() -> id, 'status' => $request -> status]);

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

            return response()->json(['message' => 'Post graduate program review application approved/rejected successfully.'], 200);
        }
        catch(AuthorizationException $e){
            DB::rollBack();
            return response()->json(['message' => $e -> getMessage()], 403);
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
        try{
            //authorize the action
            $this -> authorize('delete', $postGraduateProgramReviewApplication);

            //get the intent letter path
            $intentLetter = $postGraduateProgramReviewApplication -> intent_letter;

            //remove the intent letter from the storage if it exists
            if($intentLetter){
                $intentLetterPath = str_replace('/storage', 'public', $intentLetter);
                Storage::delete($intentLetterPath);
            }

            $postGraduateProgramReviewApplication -> delete();

            return response()->json(['message' => 'Post graduate program review application deleted successfully.'], 200);
        }
        catch(AuthorizationException $e){
            return response()->json(['message' => $e -> getMessage()], 403);
        }
        catch(\Exception $e){
            return response()->json(['message' => 'Error deleting post graduate program review application.',
                'error' => $e->getMessage()]
            , 400);
        }
    }
}
