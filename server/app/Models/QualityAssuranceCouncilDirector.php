<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QualityAssuranceCouncilOfficer;

class QualityAssuranceCouncilDirector extends Model
{
    use HasFactory;

    //quality assurance council director is a quality assurance council officer
    public function qualityAssuranceCouncilOfficer(){
        return $this -> belongsTo(QualityAssuranceCouncilOfficer::class);
    }

    // QACDirectors can reject pgprs
    public function postGraduateProgramReviews()
    {
        return $this->hasMany(PostGraduateProgramReview::class);
    }
}
