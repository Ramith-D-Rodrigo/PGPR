<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelfEvaluationReport extends Model
{
    use HasFactory;
    // self evaluation report belongs to a post graduate program review
    public function postGraduateProgramReview()
    {
        return $this->belongsTo(PostGraduateProgramReview::class);
    }

    //self evaluation report is given approval by vice chancellor
    public function viceChancellor()
    {
        return $this->belongsTo(ViceChancellor::class);
    }

    //self evaluation report is given approval by center for quality assurance director
    public function centerForQualityAssuranceDirector()
    {
        return $this->belongsTo(CenterForQualityAssuranceDirector::class);
    }

    //self evaluation report is given approval by internal quality assurance unit director
    public function internalQualityAssuranceUnitDirector()
    {
        return $this->belongsTo(InternalQualityAssuranceUnitDirector::class);
    }
}