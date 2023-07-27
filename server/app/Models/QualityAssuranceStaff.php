<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;

class QualityAssuranceStaff extends Model
{
    use HasFactory;

    protected $fillable = [
        'assigned_date'
    ];

    //quality assurance staff is a university side

    public function universitySide(){
        return $this->belongsTo(UniversitySide::class, 'id', 'id');
    }

    //quality assurance staff has one internal quality assurance unit director
    public function internalQualityAssuranceUnitDirector(){
        return $this->hasOne(InternalQualityAssuranceUnitDirector::class, 'id', 'id');
    }

    //quality assurance staff has one center for quality assurance director
    public function centerForQualityAssuranceDirector(){
        return $this->hasOne(CenterForQualityAssuranceDirector::class, 'id', 'id');
    }
}
