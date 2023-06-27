<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;

    //university has many university sides
    public function universitySides(){
        return $this->hasMany(UniversitySide::class);
    }

    //a university has many faculties
    public function faculties(){
        return $this->hasMany(Faculty::class);
    }

    //a university has one center for quality assurance
    public function centerForQualityAssurance(){
        return $this->hasOne(CenterForQualityAssurance::class);
    }
}
