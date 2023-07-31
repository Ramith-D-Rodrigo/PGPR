<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CenterForQualityAssurance extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_no',
        'fax_no',
        'center_for_quality_assurance_director_id',
        'email'
    ];

    //center for quality assurance belongs to a university
    public function university(){
        return $this->hasOne(University::class);    //changed to reverse because uni has the center for quality assurance id in its table
    }

    //center for quality assurance has many center for quality assurance directors (because change over time)
    public function centerForQualityAssuranceDirectors(){
        return $this->hasMany(CenterForQualityAssuranceDirector::class);
    }

    //there is only one center for quality assurance director at a time
    public function currentQualityAssuranceDirector(){
        return $this->hasOne(CenterForQualityAssuranceDirector::class, 'id', 'center_for_quality_assurance_director_id');
    }

    //this belongs to a university
    public function universitySide(){
        return $this->belongsTo(UniversitySide::class);
    }
}
