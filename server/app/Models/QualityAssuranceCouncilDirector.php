<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QualityAssuranceCouncilOfficer;

class QualityAssuranceCouncilDirector extends QualityAssuranceCouncilOfficer
{
    use HasFactory;

    //quality assurance council director is a quality assurance council officer

    public function qualityAssuranceCouncilOfficer(){
        return $this -> belongsTo(QualityAssuranceCouncilOfficer::class);
    }
}
