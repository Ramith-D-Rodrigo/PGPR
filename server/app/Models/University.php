<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;

    protected $fillable = [ //the following fields can be mass assigned (i.e. using University::create())
        'name',
        'address',
        'contact_no',
        'fax_no',
        'website',
        'logo',
        'center_for_quality_assurance_id',
        'quality_assurance_council_director_id',
        'vice_chancellor_id',
    ];
    //we do not need to add quality_assurance_council_director_id because they are not mass assignable (not in $fillable)

    //university has many university sides
    public function universitySides()
    {
        return $this->hasMany(UniversitySide::class, 'university_id', 'id');
    }

    //a university has many faculties
    public function faculties()
    {
        return $this->hasMany(Faculty::class, 'university_id', 'id');
    }

    public function viceChancellor()
    {
        return $this->hasOne(ViceChancellor::class ,'university_id', 'id')->latestOfMany();
    }

    //a university has one center for quality assurance
    public function centerForQualityAssurance()
    {
        return $this->hasOne(CenterForQualityAssurance::class);
    }

    //a university is created by a quality assurance council director
    public function createdQACDirector()
    {
        return $this->belongsTo(QualityAssuranceCouncilDirector::class, 'quality_assurance_council_director_id', 'id');
    }

    //a university has one vice chancellor
    // public function viceChancellor(){
    //     return $this->belongsTo(ViceChancellor::class, 'vice_chancellor_id', 'id');
    // }
}
