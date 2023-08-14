<?php

namespace App\Filters\V1;
use Illuminate\Http\Request;

class ApiFilter {
    protected $safeParams = []; //safe params are the params that are allowed to be used in the query for a particular column
    protected $columnMap = [];  //column map is used to map the column name to the param name
    protected $operatorMap = [
        'eq' => '=',
        'neq' => '!=',
        'gt' => '>',
        'gte' => '>=',
        'lt' => '<',
        'lte' => '<=',
        'like' => 'like',
        'nlike' => 'not like',
        'in' => 'in',
        'nin' => 'not in',
        'null' => 'is null',
        'nnull' => 'is not null',
    ];
    protected $eloQuery = [];//this will be the query that will be passed to the eloquent query builder
    
    public function transform(Request $request){
        foreach($this -> safeParams as $param => $operators){
            $query = $request -> query($param);

            if(!isset($query)){
                continue;
            }

            $column = $this -> columnMap[$param] ?? $param; //get the column map for this param or use the param as the column name

            foreach($operators as $operator){
                if(isset($query[$operator])){   //if the operator is set in the query
                    array_push($this -> eloQuery, [$column, $this -> operatorMap[$operator], $query[$operator]]);    //add the query to the eloquent query builder
                }
            }
        }

        return $this -> eloQuery;
    }

    public function getEloQuery(){
        return $this -> eloQuery;
    }
}
