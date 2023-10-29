<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CenterForQualityAssuranceDirector extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'center_for_quality_assurance_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    //center for quality assurance director is a quality assurance staff
    public function qualityAssuranceStaff(){
        return $this -> belongsTo(QualityAssuranceStaff::class, 'id', 'id');
    }

    //center for quality assurance director belongs to a center for quality assurance
    public function centerForQualityAssurance(){
        return $this -> belongsTo(CenterForQualityAssurance::class);
    }

    //cqa director can approve many self evaluation reports
    public function selfEvaluationReports(){
        return $this->hasMany(SelfEvaluationReport::class);
    }

    //cqa director can add a postgraduate program
    public function addedPostGraduatePrograms(){
        return $this -> hasMany(PostGraduateProgram::class, 'added_by_cqa_director_id', 'id');
    }

    //cqa director can edit a postgraduate program
    public function editedPostGraduatePrograms(){
        return $this -> hasMany(PostGraduateProgram::class, 'edited_by_cqa_director_id', 'id');
    }
}
