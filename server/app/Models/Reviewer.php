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
    public function standards(string $type) // $type should be either one of them => ['DESK', 'PROPER']
    {
        if ($type === "DESK") {
            return $this->belongsToMany(
                Standard::class,
                'desk_evaluation_score',
                'reviewer_id',
                'standard_id'
            )->withPivot('de_score');
        } else {
            return $this->belongsToMany(
                Standard::class,
                'proper_evaluation_score',
                'reviewer_id',
                'standard_id'
            )->withPivot('pe_score');
        }
    }

    //reviewer working faculty
    public function workingFaculty(){
        return $this -> belongsTo(Faculty::class, 'working_faculty');
    }
}
