<?php

namespace App\Filters\V1;
use Illuminate\Support\Facades\Auth;

class UniversityFilter extends ApiFilter{
    protected $safeParams = [
        'name',
        'address',
        'website',
    ];

    public function __construct($userRole, $request){
        $this -> transform($request);

        //role wise filtering
        switch($userRole){
            //cqa,vice chancellor,dean,iqau_director,programme_coordinator can view only their own university
            case 'cqa_director':
            case 'vice_chancellor':
            case 'dean':
            case 'iqau_director':
            case 'programme_coordinator':
                //get the university id of the user
                $user = Auth::user();
                $uniID = $user -> universitySide -> university -> id;

                //set the eloquent query to filter their university
                $this -> safeParams['id'] = ['eq'];
                array_push($this -> eloQuery, ['id', '=', $uniID]);
                break;
        }
        //others have no restrictions
    }

}
