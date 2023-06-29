<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reviewer extends Model
{
    use HasFactory;

    //reviewer is an academic staff
    public function academicStaff(){
        return $this->belongsTo(AcademicStaff::class);
    }

    public function reviewTeams(){
        return $this -> belongsToMany(ReviewTeam::class, 'reviewer_review_team');
    }

    // reviewers can score for many standards
    public function deskEvaluationScores()
    {
        return $this->belongsToMany(Standard::class, 'desk_evaluation_score')->withPivot('de_score');
    }

    public function properEvaluationScores()
    {
        return $this->belongsToMany(Standard::class, 'proper_evaluation_score')->withPivot('pe_score');
    }
}
