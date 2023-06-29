<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewTeam extends Model
{
    use HasFactory;


    //review team has many reviewers and reviewers belong to many review teams (many-to-many relationship)
    public function reviewers(){
        return $this -> belongsToMany(Reviewer::class, 'reviewer_review_team');
    }

    //review team is created by a quality assurance council officer (one-to-many relationship)
    public function qualityAssuranceCouncilOfficer(){
        return $this -> belongsTo(QualityAssuranceCouncilOfficer::class);
    }

    //review team is given consent by a dean (one-to-many relationship)
    public function dean(){
        return $this -> belongsTo(Dean::class);
    }

    // review team belongs to a pgpr
    public function postGraduateReviewProgram()
    {
        return $this->belongsTo(
            PostGraduateProgramReview::class,
            'pgpr_id',
            'id'
        );
    }

    // review team has a final report
    public function finalReports()
    {
        return $this->hasMany(FinalReport::class, 'review_team_id');
    }
}
