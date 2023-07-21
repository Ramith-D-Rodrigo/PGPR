<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostGraduateProgramReviewApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'intent_letter',
        'request_date',
        'application_date',
        'dean_id',
        'year_1',
        'year_2',
        'year_3',
        'year_4',
        'year_5',
        'y_end',
        'post_graduate_program_id',
        'quality_assurance_council_officer_id'
    ];

    //dean submits many post graduate program review applications (intent letter)
    public function deans(){
        return $this->belongsTo(Dean::class);
    }
    //application is given approval by one qac officer
    public function qualityAssuranceCouncilOfficer(){
        return $this->belongsTo(QualityAssuranceCouncilOfficer::class);
    }

    //review application has many post graduate programs and post graduate programs belong to many review applications
    public function postGraduatePrograms(){
        return $this->belongsTo(PostGraduateProgram::class, 'post_graduate_program_id');
    }

    //review application has many post graduate program reviews
    public function postGraduateProgramReviews(){
        return $this->hasMany(PostGraduateProgramReview::class, 'pgpr_application_id', 'id');
    }

}
