<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalQualityAssuranceUnitDirector extends Model
{
    use HasFactory;

    //internal quality assurance unit director is a quality assurance staff
    public function qualityAssuranceStaff(){
        return $this -> belongsTo(QualityAssuranceStaff::class);
    }

    // An IQAUDirector belongs to an IQAU
    public function internalQualityAssuranceUnit()
    {
      return $this->belongsTo(InternalQualityAssuranceUnit::class, 'iqau_id', 'id');
    }
}
