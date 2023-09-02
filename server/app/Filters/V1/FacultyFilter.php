<?php

namespace App\Filters\V1;
use Illuminate\Support\Facades\Auth;

class FacultyFilter extends ApiFilter{
    protected $safeParams = [
        'name' => ['eq', 'neq', 'like', 'nlike', 'in', 'nin'],
        'universityId' => ['eq', 'neq', 'in', 'nin'],
        'deanId' => ['eq', 'neq', 'in', 'nin'],
        'website' => ['eq', 'neq', 'like', 'nlike', 'in', 'nin'],
        'address' => ['eq', 'neq', 'like', 'nlike', 'in', 'nin'],

        //no need to filter contactNo and faxNo
    ];

    protected $columnMap = [
        'deanId' => 'dean_id',
        'universityId' => 'university_id'
    ];

    public function __construct($userRole, $request){
        $this -> transform($request);

        //role wise filtering
        switch($userRole){
            //cqa and vice chancellor can view only the faculties of their university
            case 'cqa_director':
            case 'vice_chancellor':
                //get the faculties of the university
                $user = Auth::user();
                $uniID = $user -> universitySide -> university -> id;

                //set the eloquent query to filter their faculties in the university
                $this -> safeParams['universityId'] = ['eq'];

                //find the column faculty_id in query items
                $universityIdColumnIndex = array_search('university_id', array_column($this -> eloQuery, 0));

                if($universityIdColumnIndex !== false){
                    //set the faculty ids
                    $this -> eloQuery[$universityIdColumnIndex] = ['university_id', '=', $uniID];
                }
                else{
                    array_push($this -> eloQuery, ['university_id', '=', $uniID]);
                }
                break;

            //dean and iqau director can view only their faculty
            case 'dean':
            case 'iqau_director':
                //dean and iqau director can view only their faculty programme coordinators
                $this -> safeParams['universityId'] = ['eq'];
                //get their faculty id
                $user = Auth::user();
                $facultyID = null;
                switch($userRole){
                    case 'dean':
                        $facultyID = $user -> universitySide -> academicStaff -> dean -> faculty_id;
                        break;
                    case 'iqau_director':
                        $facultyID = $user
                                        -> universitySide
                                        -> qualityAssuranceStaff
                                        -> internalQualityAssuranceUnitDirector
                                        -> internalQualityAssuranceUnit
                                        -> faculty_id;
                        break;
                }

                //set the id in the eloquent query
                array_push($this -> eloQuery, ['id', '=', $facultyID]);

                break;

            case 'qac_director':
            case 'qac_officer':
            case 'reviewer':
                //qac director, qac officer and reviewer can view all the faculties
                break;
        }
    }


}
