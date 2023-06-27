<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CenterForQualityAssurance extends Model
{
    use HasFactory;

    //center for quality assurance belongs to a university
    public function university(){
        return $this->belongsTo(University::class);
    }

    //center for quality assurance has many center for quality assurance directors (because change over time)
    public function centerForQualityAssuranceDirector(){
        return $this->hasMany(CenterForQualityAssuranceDirector::class);
    }

    //this belongs to a university
    public function universitySide(){
        return $this->belongsTo(UniversitySide::class);
    }
}
