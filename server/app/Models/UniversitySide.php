<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversitySide extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'university_id',
        //'staff_position'
    ];

    //university side is a user
    public function user(){
        return $this -> belongsTo(User::class, 'id');
    }

    //there is one quality assurance staff who is a university side
    public function qualityAssuranceStaff(){
        return $this -> hasOne(QualityAssuranceStaff::class, 'id');
    }

    //there is one academic staff who is a university side
    public function academicStaff(){
        return $this -> hasOne(AcademicStaff::class, 'id', 'id');
        // return $this -> hasOne(AcademicStaff::class, 'id');
    }

    //there is a vice chancellor who is a university side
    public function viceChancellor(){
        return $this -> hasOne(ViceChancellor::class, 'id');
    }

    //this belongs to a university
    public function university(){
        return $this -> belongsTo(University::class, 'id');
    }
}
