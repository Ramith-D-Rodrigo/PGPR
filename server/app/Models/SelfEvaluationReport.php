<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelfEvaluationReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_graduate_program_review_id',
        'pgp_coordinator_id',
        'vice_chancellor_id',
        'section_a',
        'section_b',
        'section_d',
        'final_ser_report',
        'iqau_dir_id',
        'center_for_quality_assurance_director_id'
    ];

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
        return $this->belongsTo(InternalQualityAssuranceUnitDirector::class, 'iqau_dir_id');
    }

    public function evidences()
    {
        return $this->belongsToMany(Evidence::class, 'ser_evidence_standard', 'ser_id', 'evidence_id');
    }

    public function standards()
    {
        return $this->belongsToMany(Standard::class, 'ser_evidence_standard', 'ser_id', 'standard_id');
    }

    public function adherenceToStandards()
    {
        return $this->belongsToMany(Standard::class, 'ser_standard_adherence', 'ser_id', 'standard_id')->withPivot('adherence');
    }
}
