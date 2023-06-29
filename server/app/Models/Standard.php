<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Standard extends Model
{
    use HasFactory;

    //1 to many relationship between criteria and standards
    public function criteria(){
        return $this -> belongsTo(Criteria::class);
    }

    // standard belongs to many proper evaluations
    public function properEvaluations()
    {
        return $this->belongsToMany(ProperEvaluation::class, 'proper_evaluation_score', 'standard_id', 'pe_id')->withPivot('pe_score');
    }

    // standard belongs to many desk evaluations
    public function deskEvaluations()
    {
        return $this->belongsToMany(DeskEvaluation::class, 'desk_evaluation_score', 'standard_id', 'de_id')->withPivot('de_score');
    }
}
