<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dean extends Model
{
    use HasFactory;

    //dean is an academic staff
    public function academicStaff(){
        return $this->belongsTo(AcademicStaff::class);
    }

    //dean belongs to a faculty
    public function faculty(){
        return $this->belongsTo(Faculty::class);
    }

    //dean give consent to many review teams and review teams can only be given consent by one dean
    public function reviewTeams(){
        return $this -> hasMany(ReviewTeam::class);
    }

    // dean can send many intent letters
    public function postGraduateProgramReviewApplications()
    {
        return $this->hasMany(postGraduateProgramReviewApplication::class, 'dean_id');
    }
}
