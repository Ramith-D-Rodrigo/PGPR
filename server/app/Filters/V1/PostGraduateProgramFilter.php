<?php

namespace App\Filters\V1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostGraduateProgramFilter extends ApiFilter{
    protected $safeParams = [
        'title' => ['eq', 'neq', 'like', 'nlike'],
        'slqfLevel' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
        'commencementYear' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
        'facultyId' => ['eq', 'neq','in', 'nin'],
        'addedByCqaDirectorId' => ['eq', 'neq','in', 'nin'],
        'editedByCqaDirectorId' => ['eq', 'neq','in', 'nin'],
        'programmeCoordinatorId' => ['eq', 'neq','in', 'nin']
    ];

    protected $columnMap = [
        'slqfLevel' => 'slqf_level',
        'commencementYear' => 'commencement_year',
        'facultyId' => 'faculty_id',
        'addedByCqaDirectorId' => 'added_by_cqa_director_id',
        'editedByCqaDirectorId' => 'edited_by_cqa_director_id',
        'programmeCoordinatorId' => 'programme_coordinator_id'
    ];

    //for a given role, there can be filters that are must have (i.e. cannot be removed)
    public function __construct($userRole, $request){ //better to use constructor to set those must have filters
        //first transform the request
        $this -> transform($request);

        //role wise authorization
        //authorized roles = [dean, cqa_director, qac_officer, qac_director, reviewer, vice_chancellor, programme_coordinator, iqau_director]
        //dean, iqau_director, programme_coordinator can view only their faculty pgps
        //cqa_director, vice_chancellor can view all pgps of their university
        //qac_director, qac_officer can view all the pgps in the system
        switch($userRole){
            case 'dean':
            case 'iqau_director':
            case 'programme_coordinator':
                $this -> safeParams['facultyId'] = ['eq'];

                //set the eloquent query to filter only the faculty pgps
                //get the faculty id of the user
                $user = Auth::user();
                $facultyID = null;
                switch($userRole){
                    case 'dean':
                        $facultyID = $user -> universitySide -> academicStaff -> dean -> faculty_id;
                        break;
                    case 'iqau_director':
                        $facultyID = $user -> universitySide -> qualityAssuranceStaff -> internalQualityAssuranceUnitDirector -> internalQualityAssuranceUnit -> faculty_id;
                        break;
                    case 'programme_coordinator':
                        $facultyID = $user -> universitySide -> academicStaff -> programmeCoordinator -> faculty_id;
                        break;
                }

                //find the column faculty_id in query items
                $facultyIdColumnIndex = array_search('faculty_id', array_column($this -> eloQuery, 0));

                //if the faculty_id column is not found in the query items, add it
                if($facultyIdColumnIndex === false){
                    array_push($this -> eloQuery, ['faculty_id', '=', $facultyID]);
                }
                //if the faculty_id column is found in the query items then update so that it filters only the faculty pgps
                else{
                    $this -> eloQuery[$facultyIdColumnIndex] = ['faculty_id', '=', $facultyID];
                }
                break;

            //cqa_director, vice_chancellor can view all pgps of their university
            case 'cqa_director':
            case 'vice_chancellor':
                $this -> safeParams['facultyId'] = ['eq', 'neq', 'in', 'nin'];

                //set the eloquent query to filter only the university pgps
                //get the university id of the user
                $user = Auth::user();
                $facultyIDs = $user -> universitySide -> universities -> faculties -> pluck('id') -> toArray();

                //find the column faculty_id in query items
                $facultyIdColumnIndex = array_search('faculty_id', array_column($this -> eloQuery, 0));

                //if the faculty_id column is not found in the query items, add it
                if($facultyIdColumnIndex === false){
                    array_push($this -> eloQuery, ['faculty_id', 'in', $facultyIDs]);
                }
                //if the faculty_id column is found in the query items then update so that it filters only the university pgps
                else{
                    $this -> eloQuery[$facultyIdColumnIndex] = ['faculty_id', 'in', $facultyIDs];
                }
                break;

            //qac_director, qac_officer can view all the pgps in the system (no restrictions)
            case 'qac_director':
            case 'qac_officer':
            case 'reviewer':
                break;
        }
    }
}
