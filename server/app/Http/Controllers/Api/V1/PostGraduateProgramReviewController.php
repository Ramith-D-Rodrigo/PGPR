<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\StorePostGraduateProgramReviewRequest;
use App\Http\Requests\V1\UpdatePostGraduateProgramReviewRequest;
use App\Http\Resources\V1\PostGraduateProgramReviewCollection;
use App\Http\Resources\V1\PostGraduateProgramReviewResource;
use App\Models\PostGraduateProgramReview;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;

class PostGraduateProgramReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $this->authorize('viewAny', PostGraduateProgramReview::class);

            //load related data
            $pgprs = PostGraduateProgramReview::with([
                'postGraduateProgram' => [
                    'faculty' => [
                        'university'
                    ]
                ],
                'selfEvaluationReport:id,post_graduate_program_review_id,pgp_coordinator_id' => [
                    'programmeCoordinator:id' => [
                        'academicStaff:id' => [
                            'universitySide:id' => [
                                'user:id,initials,surname,profile_pic'
                            ]
                        ]
                    ]
                ],
                'postGraduateProgramReviewApplication'
            ]);

            return new PostGraduateProgramReviewCollection($pgprs->get());
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occured while trying to fetch post graduate program reviews',
                'error' => $e->getMessage()
            ], 500);
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
    public function store(StorePostGraduateProgramReviewRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PostGraduateProgramReview $postGraduateProgramReview)
    {
        try {
            $this->authorize('view', $postGraduateProgramReview);

            //load related data
            $pgpr = $postGraduateProgramReview->load([
                'postGraduateProgram' => [
                    'faculty' => [
                        'university'
                    ],
                ],
                'selfEvaluationReport:id,post_graduate_program_review_id,pgp_coordinator_id' => [
                    'programmeCoordinator:id' => [
                        'academicStaff:id' => [
                            'universitySide:id' => [
                                'user:id,initials,surname,profile_pic'
                            ]
                        ]
                    ]
                ],
                'postGraduateProgramReviewApplication',
                'properEvaluations',
                'deskEvaluations',
                'acceptedReviewTeam' => [
                    'reviewers' => [
                        'user:id,initials,surname,profile_pic'
                    ]
                ],
                'finalReports'
            ]);

            return new PostGraduateProgramReviewResource($pgpr);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostGraduateProgramReview $postGraduateProgramReview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostGraduateProgramReviewRequest $request, PostGraduateProgramReview $postGraduateProgramReview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostGraduateProgramReview $postGraduateProgramReview)
    {
        //
    }
}
