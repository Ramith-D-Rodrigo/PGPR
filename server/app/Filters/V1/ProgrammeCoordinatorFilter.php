<?php

namespace App\Filters\V1;
use Illuminate\Support\Facades\Auth;

class ProgrammeCoordinatorFilter extends ApiFilter{
    protected $safeParams = [
        'facultyId' => ['eq', 'neq','in', 'nin'],
        'postGradProgramId' => ['eq', 'neq','in', 'nin'],
        'assignedDate' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
        'currentStatus' => ['eq', 'neq', 'in', 'nin']
    ];

    protected $columnMap = [
        'facultyId' => 'faculty_id',
        'postGradProgramId' => 'post_grad_program_id',
        'assignedDate' => 'assigned_date',
        'currentStatus' => 'current_status'
    ];



    public function __construct($userRole, $request){
        $this -> transform($request);

        //role wise filtering
        switch($userRole){
            case 'cqa_director':
            case 'vice_chancellor':
                //get the faculties of the university
                $user = Auth::user();
                $facultyIDs = $user -> universitySide -> university -> faculties -> pluck('id') -> toArray();

                //set the eloquent query to filter only the programme coordinators of the university
                $this -> safeParams['facultyId'] = ['in'];

                //find the column faculty_id in query items
                $facultyIdColumnIndex = array_search('faculty_id', array_column($this -> eloQuery, 0));

                if($facultyIdColumnIndex !== false){
                    //set the faculty ids
                    $this -> eloQuery[$facultyIdColumnIndex] = ['faculty_id', 'in', $facultyIDs];
                }
                else{
                    array_push($this -> eloQuery, ['faculty_id', 'in', $facultyIDs]);
                }
                break;

            case 'dean':
            case 'iqau_director':
                //dean and iqau director can view only their faculty programme coordinators
                $this -> safeParams['facultyId'] = ['eq'];
                //get their faculty id
                $user = Auth::user();
                $facultyID = null;
                switch($userRole){
                    case 'dean':
                        $facultyID = $user -> universitySide -> academicStaff -> dean -> faculty_id;
                        break;
                    case 'iqau_director':
                        $facultyID = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty_id;
                        break;
                }

                //find the column faculty_id in query items
                $facultyIdColumnIndex = array_search('faculty_id', array_column($this -> eloQuery, 0));

                if($facultyIdColumnIndex !== false){
                    //set the faculty id
                    $this -> eloQuery[$facultyIdColumnIndex] = ['faculty_id', '=', $facultyID];
                }
                else{
                    array_push($this -> eloQuery, ['faculty_id', '=', $facultyID]);
                }
                break;

            case 'programme_coordinator':
                //only can view his/her own profile
                //set the id of the eloquent query to the id of the authenticated user
                $user = Auth::user();
                array_push($this -> eloQuery, ['id', 'eq', $user -> id]);
                break;

            case 'qac_officer':
            case 'qac_director':
                //qac officer and qac director can view all programme coordinators (no filtering)
                break;
        }
    }
}
