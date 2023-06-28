<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualityAssuranceCouncilOfficer extends Model
{
    use HasFactory;

    //quality assurance council officer is a user
    public function user(){
        return $this -> belongsTo(User::class);
    }

    //there is a quality assurance council director who is a quality assurance council officer
    public function qualityAssuranceCouncilDirector(){
        return $this -> hasOne(QualityAssuranceCouncilDirector::class);
    }

    //quality assurance council officer creates many review teams and review teams belong to a quality assurance council officer (one-to-many relationship)
    public function reviewTeams(){
        return $this -> hasMany(ReviewTeam::class);
    }
}