<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalReport extends Model
{
    use HasFactory;

    // final report is compiled by a review team
    public function reviewTeams()
    {
        return $this->belongsTo(ReviewTeam::class, 'review_team_id', 'id');
    }

    // final reports belongs to a post graduate review program
    public function postGraduateProgramReview()
    {
        return $this->belongsTo(PostGraduateProgramReview::class, 'pgpr_id', 'id');
    }
}
