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
        return $this -> belongsTo(QualityAssuranceCouncilOfficer::class, 'id', 'id');
    }

    // QACDirectors can reject pgprs
    public function postGraduateProgramReviews()
    {
        return $this->hasMany(PostGraduateProgramReview::class, 'qac_dir_id');
    }

    //qac director belongs to a user through quality assurance council officer
    public function user(){
        return $this -> belongsTo(User::class, 'id', 'id');
    }

    //qac director creates many universities
    public function createdUniversities(){
        return $this->hasMany(University::class);
    }
}
