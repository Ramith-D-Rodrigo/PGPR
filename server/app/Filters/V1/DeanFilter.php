<?php

namespace App\Filters\V1;
use Illuminate\Support\Facades\Auth;

class DeanFilter extends ApiFilter {
    protected $safeParams = [
        'facultyId' => ['eq', 'neq', 'in', 'nin'],
        'assignedDate' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
        'currentStatus' => ['eq', 'neq']
    ];

    protected $columnMap = [
        'facultyId' => 'faculty_id',
        'assignedDate' => 'assigned_date',
        'currentStatus' => 'current_status'
    ];

    public function __construct($userRole, $request){
        $this -> transform($request);

        //role wise filtering
        switch($userRole){
            case 'cqa_director':
            case 'vice_chancellor':
                //cqa and vc can only view their university deans
                $this -> safeParams['facultyId'] = ['in'];
                //get the faculties of the university
                $user = Auth::user();
                $facultyIDs = $user -> universitySide -> university -> faculties -> pluck('id') -> toArray();

                //find the column faculty_id in query items
                $facultyIdColumnIndex = array_search('faculty_id', array_column($this -> whereInQuery, 0));

                if($facultyIdColumnIndex !== false){
                    //set the faculty ids
                    $this -> whereInQuery[$facultyIdColumnIndex] = ['faculty_id', $facultyIDs];
                }
                else{
                    array_push($this -> whereInQuery, ['faculty_id', $facultyIDs]);
                }

                break;

            case 'iqau_director':
            case 'programme_coordinator':
                //iqau and coordinator can view only their faculty dean

                //get their faculty id
                $user = Auth::user();
                $facultyID = null;
                switch($userRole){
                    case 'iqau_director':
                        $facultyID = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty_id;
                        break;
                    case 'programme_coordinator':
                        $facultyID = $user -> universitySide -> academicStaff -> programmeCoordinator -> postGraduateProgram -> faculty_id;
                        break;
                }

                //set the faculty id
                $this -> safeParams['facultyId'] = ['eq'];
                //find the column faculty_id in query items
                $facultyIdColumnIndex = array_search('faculty_id', array_column($this -> eloQuery, 0));

                if($facultyIdColumnIndex !== false){
                    //set the faculty ids
                    $this -> eloQuery[$facultyIdColumnIndex] = ['faculty_id', '=', $facultyID];
                }
                else{
                    array_push($this -> eloQuery, ['faculty_id', '=', $facultyID]);
                }

                break;

            case 'dean':
                //dean can view only his profile

                //set id
                $user = Auth::user();
                array_push($this -> eloQuery, ['id', '=', $user -> id]);
                break;
            //others have no restrictions
        }
    }
}
