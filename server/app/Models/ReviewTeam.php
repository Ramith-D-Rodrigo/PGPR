<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ReviewTeam extends Model
{
    use HasFactory;

    //there can only be 3 reviewers at most per group
    protected static function boot(): void
    {
        parent::boot();
        static::saving(function ($team) {
            if ($team->reviewers->count() > 3) {
                return false;
            }
            return true;
        }
        );
    }


    //review team has many reviewers and reviewers belong to many review teams (many-to-many relationship)
    public function reviewers(): BelongsToMany
    {
        return $this->belongsToMany(
            Reviewer::class,
            'reviewer_review_teams',
            'review_team_id',
            'reviewer_id'
        )->withPivot([
            'role',
            'declaration_letter',
            'reviewer_confirmation',
        ])->with(['user', 'workingFaculty', 'workingFaculty.university']);
    }

    //review team is created by a quality assurance council officer (one-to-many relationship)
    public function qualityAssuranceCouncilOfficer(): BelongsTo
    {
        return $this->belongsTo(QualityAssuranceCouncilOfficer::class);
    }

    //review team is given consent by a dean (one-to-many relationship)
    public function dean()
    {
        return $this->belongsTo(Dean::class);
    }

    //review team set criteria for proper evaluation and criterias can be used by many review teams (many-to-many relationship)
    public function properEvaluationCriteria()
    {
        return $this->belongsToMany(Criteria::class,
            'review_team_set_criterias',
            'review_team_id',
            'criteria_id'
        );
    }

    // review team belongs to a pgpr
    public function postGraduateReviewProgram()
    {
        return $this->belongsTo(
            PostGraduateProgramReview::class,
            'pgpr_id',
            'id'
        )->with(['properEvaluations', 'deskEvaluations']);
    }

    // review team has a final report
    public function finalReports()
    {
        return $this->hasMany(FinalReport::class, 'review_team_id');
    }
}
