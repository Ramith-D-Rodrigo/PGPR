<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Reviewer extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'working_faculty',
        'reviewer_status' //pending, accepted, rejected, suspended
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    //reviewer is an academic staff
    public function academicStaff(): BelongsTo
    {
        return $this->belongsTo(AcademicStaff::class, 'id', 'id');
    }

    public function reviewTeams(): BelongsToMany
    {
        return $this->belongsToMany(
            ReviewTeam::class,
            'reviewer_review_teams',
            'reviewer_id',
            'review_team_id'
        )->withPivot([
            'role',
            'declaration_letter',
            'reviewer_confirmation',
        ])->with('postGraduateReviewProgram.postGraduateProgram.faculty.university');
    }

    // reviewers can score for many standards
    public function standards(string $type): BelongsToMany // $type should be either one of them => ['DESK', 'PROPER']
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
    public function workingFaculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'working_faculty', 'id')->with('university');
    }
}
