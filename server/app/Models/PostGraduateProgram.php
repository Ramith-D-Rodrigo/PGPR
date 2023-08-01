<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostGraduateProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slqf_level',
        'commencement_year',
        'faculty_id',
        'added_by_cqa_director_id',
        'edited_by_cqa_director_id',
        'programme_coordinator_id',
        'is_professional_pg_programme'
    ];

    // PostGraduateProgram is offered by a faculty
    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id', 'id');
    }

    //has programme coordinator (many)
    public function programmeCoordinators()
    {
        return $this->hasMany(ProgrammeCoordinator::class, 'post_grad_program_id', 'id');
    }

    //current programme coordinator
    public function currentProgrammeCoordinator()
    {
        return $this->hasOne(ProgrammeCoordinator::class, 'id', 'programme_coordinator_id');
    }

    // post graduate programs have many pgprs
    public function postGraduateProgramReviews()
    {
        return $this->hasMany(PostGraduateProgramReview::class, 'post_graduate_program_id', 'id');
    }

    // post graduate programs have many post graduate program review applications
    public function postGraduateProgramReviewApplications()
    {
        return $this->hasMany(PostGraduateProgramReviewApplication::class);
    }

    //edited by cqa director
    public function editedCQADirector(){
        return $this -> belongsTo(CenterForQualityAssuranceDirector::class, 'edited_by_cqa_director_id', 'id');
    }

    //added by cqa director
    public function addedCQADirector(){
        return $this -> belongsTo(CenterForQualityAssuranceDirector::class, 'added_by_cqa_director_id', 'id');
    }
}
