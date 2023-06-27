<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CenterForQualityAssuranceDirector extends Model
{
    use HasFactory;

    //center for quality assurance director is a quality assurance staff
    public function qualityAssuranceStaff(){
        return $this -> belongsTo(QualityAssuranceStaff::class);
    }
}
