<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CenterForQualityAssuranceDirector extends Model
{
    use HasFactory;

    //center for quality assurance director is a quality assurance staff
    public function qualityAssuranceStaff(){
        return $this -> belongsTo(QualityAssuranceStaff::class);
    }

    //center for quality assurance director belongs to a center for quality assurance
    public function centerForQualityAssurance(){
        return $this -> belongsTo(CenterForQualityAssurance::class);
    }

    // post graduate program can be recommended by the center for quality assurance director
    public function postGraduateProgramReviews()
    {
        return $this->hasMany(PostGraduateProgramReview::class, 'cqa_dir_id');
    }
}
