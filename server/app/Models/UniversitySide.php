<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversitySide extends Model
{
    use HasFactory;

    //university side is a user
    public function user(){
        return $this -> belongsTo(User::class);
    }

    //there is one quality assurance staff who is a university side
    public function qualityAssuranceStaff(){
        return $this -> hasOne(QualityAssuranceStaff::class);
    }

    //there is one academic staff who is a university side
    public function academicStaff(){
        return $this -> hasOne(AcademicStaff::class);
    }

    //there is a vice chancellor who is a university side
    public function viceChancellor(){
        return $this -> hasOne(ViceChancellor::class);
    }

    //this belongs to a university
    public function university(){
        return $this -> belongsTo(University::class);
    }
}