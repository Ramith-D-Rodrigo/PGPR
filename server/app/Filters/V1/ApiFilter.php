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

    protected $whereInQuery = []; //where in query builder

    protected $whereNotInQuery = []; //where not in query builder

    protected $whereIsNullQuery = []; //where is null query builder

    protected $whereIsNotNullQuery = []; //where is not null query builder

    public function transform(Request $request){
        foreach($this -> safeParams as $param => $operators){
            $query = $request -> query($param);

            if(!isset($query)){
                continue;
            }

            $column = $this -> columnMap[$param] ?? $param; //get the column map for this param or use the param as the column name

            foreach($operators as $operator){
                if(isset($query[$operator])){   //if the operator is set in the query
                    if($operator == 'in'){
                        $this -> transformWhereInQuery($column, $query[$operator]);
                        continue;
                    }

                    if($operator == 'nin'){
                        $this -> transformWhereNotInQuery($column, $query[$operator]);
                        continue;
                    }

                    if($operator == 'null'){
                        $this -> transformWhereIsNullQuery($column);
                        continue;
                    }

                    if($operator == 'nnull'){
                        $this -> transformWhereIsNotNullQuery($column);
                        continue;
                    }

                    array_push($this -> eloQuery, [$column, $this -> operatorMap[$operator], $query[$operator]]);    //add the query to the eloquent query builder
                }
            }
        }

        return $this -> eloQuery;
    }

    public function transformWhereInQuery($column, $values){
        array_push($this -> whereInQuery, [$column, $values]);
    }

    public function transformWhereNotInQuery($column, $values){
        array_push($this -> whereNotInQuery, [$column, $values]);
    }

    public function transformWhereIsNullQuery($column){
        array_push($this -> whereIsNullQuery, $column);
    }

    public function transformWhereIsNotNullQuery($column){
        array_push($this -> whereIsNotNullQuery, $column);
    }

    public function getWhereIsNullQuery(){
        return $this -> whereIsNullQuery;
    }

    public function getWhereIsNotNullQuery(){
        return $this -> whereIsNotNullQuery;
    }

    public function getWhereInQuery(){
        return $this -> whereInQuery;
    }

    public function getWhereNotInQuery(){
        return $this -> whereNotInQuery;
    }


    public function getEloQuery(){
        return $this -> eloQuery;
    }
}
