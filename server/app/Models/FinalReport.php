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
        return $this->belongsTo(ReviewTeam::class);
    }

    // final reports belongs to a post graduate review program
    public function postGraduateProgramReview()
    {
        return $this->belongsTo(PostGraduateProgramReview::class);
    }
}
