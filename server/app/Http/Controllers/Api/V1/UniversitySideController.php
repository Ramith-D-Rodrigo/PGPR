<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\V1\AssignReviewerRoleRequest;
use App\Http\Resources\V1\UniversitySideCollection;
use App\Models\AcademicStaff;
use App\Models\Reviewer;
use App\Models\UniversitySide;
use App\Http\Requests\StoreUniversitySideRequest;
use App\Http\Requests\UpdateUniversitySideRequest;
use App\Http\Controllers\Controller;
use App\Mail\AssignReviewerRole;
use App\Services\V1\AcademicStaffService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request;

class UniversitySideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return new UniversitySideCollection(
            UniversitySide::with(['user', 'university'])
                ->whereHas('user', function ($query) {
                    $query->whereJsonDoesntContain('roles', 'vice_chancellor');
                })
                ->get()
        );
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
    public function store(StoreUniversitySideRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UniversitySide $universitySide)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UniversitySide $universitySide)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniversitySideRequest $request, UniversitySide $universitySide)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UniversitySide $universitySide)
    {
        //
    }

    public function assignReviewerRole(UniversitySide $universitySide, AssignReviewerRoleRequest $request) {
        try{
            $this -> authorize('assignReviewerRoleAuthorize', $universitySide);

            $roles = json_decode($universitySide -> user -> roles);

            if(in_array('vice_chancellor', $roles)){
                return response()->json([
                    'message' => 'Vice chancellor cannot be a reviewer'
                ], 403);
            }

            if(in_array('qac_director', $roles)){
                return response()->json([
                    'message' => 'QAC Director cannot be a reviewer'
                ], 403);
            }

            if(in_array('qac_officer', $roles)){
                return response()->json([
                    'message' => 'QAC Officer chancellor cannot be a reviewer'
                ], 403);
            }

            if(in_array('reviewer', $roles)){
                return response()->json([
                    'message' => 'This user is already a reviewer'
                ], 403);
            }


            $validatedData = $request -> validated();
            $validatedData['id'] = $universitySide -> id;


            //check if the user is dean, programme coordinator or iqau director
            if(in_array('dean', $roles) || in_array('programme_coordinator', $roles) || in_array('iqau_director', $roles)){
                if($universitySide -> academicStaff -> dean && $universitySide -> academicStaff -> dean -> current_status == 'ACTIVE'){
                    $validatedData['working_faculty'] = $universitySide -> academicStaff -> dean -> faculty -> id;
                }
                if($universitySide -> academicStaff -> programmeCoordinator && $universitySide -> academicStaff -> programmeCoordinator -> current_status == 'ACTIVE'){
                    $validatedData['working_faculty'] = $universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram -> faculty -> id;
                }
                if($universitySide -> qualityAssuranceStaff &&
                $universitySide
                -> qualityAssuranceStaff
                -> internalQualityAssuranceUnitDirector
                -> internalQualityAssuranceUnit
                -> internalQualityAssuranceUnitDirector -> id == $universitySide -> id){
                    $validatedData['working_faculty'] = $universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty -> id;
                }
            }
            $academicStaff = $universitySide -> academicStaff;

            DB::beginTransaction();

            //assign reviewer role
            $universitySide -> user -> update(
                ['roles' => json_encode(array_push($roles, 'reviewer'))]
            );

            //if the user does not have a academic staff model, create one
            if(!$academicStaff){
                $validatedData['postgraduate_qualifications'] = AcademicStaffService::concatPostgraudateQualifications($validatedData);
                $academicStaff = AcademicStaff::create($validatedData);

                //assign the academic staff model to the university side model
                $universitySide -> academicStaff() -> save($academicStaff);
            }

            //now create a reviewer model for the academic staff model

            $validatedData['status'] = 'pending';
            $reviewer = Reviewer::create($validatedData);


            //assign the reviewer model to the academic staff model
            $academicStaff -> reviewer() -> save($reviewer);


            //send the email to the user
            Mail::to($universitySide -> user -> official_email)->send(new AssignReviewerRole($universitySide -> user, "Appointment of Reviewer for Postgraduate Programme Review", "mail.assignReviewerRole"));

            DB::commit();

            return response()->json([
                'message' => 'Reviewer role assigned successfully'
            ], 200);
        }
        catch(AuthorizationException $e){
            return response()->json([
                'message' => $e -> getMessage()
            ], 403);
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e -> getMessage()
            ], 500);
        }
    }
}
