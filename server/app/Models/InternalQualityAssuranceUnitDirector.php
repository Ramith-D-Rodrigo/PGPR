<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternalQualityAssuranceUnitDirector extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'iqau_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    //internal quality assurance unit director is a quality assurance staff
    public function qualityAssuranceStaff(){
        return $this -> belongsTo(QualityAssuranceStaff::class, 'id', 'id');
    }

    // An IQAUDirector belongs to an IQAU
    public function internalQualityAssuranceUnit()
    {
      return $this->hasOne(InternalQualityAssuranceUnit::class, 'iqau_dir_id', 'id');
    }

    // IQAUDirectors can can approve many self evaluation reports
    public function selfEvaluationReports(){
        return $this->hasMany(SelfEvaluationReport::class, 'iqau_dir_id');
    }
}
