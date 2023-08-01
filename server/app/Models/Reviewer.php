<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reviewer extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'working_faculty',
        'reviewer_status' //pending, accepted, rejected, suspended
    ];

    //reviewer is an academic staff
    public function academicStaff(){
        return $this->belongsTo(AcademicStaff::class, 'id', 'id');
    }

    public function reviewTeams(){
        return $this->belongsToMany(
            ReviewTeam::class,
            'reviewer_review_teams',
            'reviewer_id',
            'review_team_id'
        )->withPivot([
            'role',
            'declaration_letter',
            'reviewer_confirmation',
        ]); //get the role from the pivot table
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
        return $this->belongsTo(Faculty::class, 'working_faculty', 'id');
    }
}
