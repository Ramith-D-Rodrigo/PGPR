<?php

namespace App\Filters\V1;
use Illuminate\Http\Request;

class ApiFilter {
    protected $safeParams = [];
    protected $columnMap = [];
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

    public function transform(Request $request){
        $eloQuery = []; //this will be the query that will be passed to the eloquent query builder

        foreach($this -> safeParams as $param => $operators){
            $query = $request -> query($param);

            if(!isset($query)){
                continue;
            }

            $column = $this -> columnMap[$param] ?? $param; //get the column map for this param or use the param as the column name

            foreach($operators as $operator){
                if(isset($query[$operator])){   //if the operator is set in the query
                    $eloQuery[] = [$column, $this -> operatorMap[$operator], $query[$operator]];    //add the query to the eloquent query builder
                }
            }
        }

        return $eloQuery;
    }


}
