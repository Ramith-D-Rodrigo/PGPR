<?php

namespace App\Filters\V1;
use Illuminate\Support\Facades\Auth;

class PostGraduateProgramReviewApplicationFilter extends ApiFilter{
    protected $safeParams = [
        'year_1' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
        'year_2' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
        'year_3' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
        'year_4' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
        'year_5' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
        'yEnd' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
        'postGraduateProgramId' => [ 'eq', 'ne', 'in', 'nin'],
        'applicationDate' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'nin', 'nlike', 'null', 'nnull'],
        'status' => [ 'eq', 'ne', 'in', 'nin', 'like', 'nlike'],
        'requestDate' => [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'nin', 'nlike', 'null', 'nnull' ],
    ];

    protected $columnMap = [
        'yEnd' => 'y_end',
        'postGraduateProgramId' => 'post_graduate_program_id',
        'applicationDate' => 'application_date',
        'requestDate' => 'request_date'
    ];


    public function __construct($userRole, $request){
        $this -> transform($request);

        //role wise authorization
        switch($userRole){
            case 'dean':
                //dean can only view their faculty pgpr applications

                //since pgp belongs to a faculty, we need to find the faculty of dean and get all the pgps of those faculties

                //get the faculty id of dean
                $user = Auth::user();
                $faculty = $user -> universitySide -> academicStaff -> dean -> faculty;

                $pgpIDs = $faculty -> postGraduatePrograms -> pluck('id') -> toArray();

                //set the eloquent query to filter only the faculty pgps
                $this -> safeParams['postGraduateProgramId'] = ['in'];

                //find the index of column post_graduate_program_id in whereIn query
                $pgpIDColumnIndex = array_search('post_graduate_program_id', array_column($this -> whereInQuery, 0));

                //set the pgp ids to the eloquent query
                if($pgpIDColumnIndex !== false){
                    $this -> whereInQuery[$pgpIDColumnIndex] = ['post_graduate_program_id', $pgpIDs];
                }
                else{
                    array_push($this -> whereInQuery, ['post_graduate_program_id', $pgpIDs]);
                }
                break;

            case 'cqa_director':
            //cqa director can view all pgpr applications of their university
                $user = Auth::user();
                $faculties = $user -> universitySide -> university -> faculties;

                $pgpIDs = [];

                foreach($faculties as $faculty){
                    $pgpIDs = array_merge($pgpIDs, $faculty -> postGraduatePrograms -> pluck('id') -> toArray());
                }

                //set the eloquent query to filter only the faculty pgps
                $this -> safeParams['postGraduateProgramId'] = ['in'];

                //find the index of column post_graduate_program_id in eloquent query
                $pgpIDColumnIndex = array_search('post_graduate_program_id', array_column($this -> whereInQuery, 0));

                //set the pgp ids to the eloquent query
                if($pgpIDColumnIndex !== false){
                    $this -> whereInQuery[$pgpIDColumnIndex] = ['post_graduate_program_id', $pgpIDs];
                }
                else{
                    array_push($this -> whereInQuery, ['post_graduate_program_id', $pgpIDs]);
                }

                //cqa director can only view submitted applications

                //request date must be not null
                $this -> safeParams['requestDate'] = ['nn'];

                //find the index of where is not null query
                $requestDateColumnIndex = array_search('request_date', $this -> whereIsNotNullQuery);

                //set the request date to the eloquent query
                if($requestDateColumnIndex === false){
                    array_push($this -> whereIsNotNullQuery, 'request_date');
                }

                break;

            case 'qac_officer':
            case 'qac_director':
                //they can only view applications that have rejected, approved or applied applications

                //get the status column index
                $statusColumnIndex = array_search('status', array_column($this -> whereInQuery, 0));

                //set the status to the eloquent query
                if($statusColumnIndex !== false){
                    $this -> whereInQuery[$statusColumnIndex] = ['status', ['rejected', 'approved', 'applied']];
                }
                else{
                    array_push($this -> whereInQuery, ['status', ['rejected', 'approved', 'applied']]);
                }

                break;
        }
    }
}
