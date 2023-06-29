<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostGraduateProgram extends Model
{
    use HasFactory;

    // PostGraduateProgram is offered by a faculty
    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id', 'id');
    }

    // post graduate programs have many pgprs
    public function postGraduateProgramReviews()
    {
        return $this->hasMany(PostGraduateProgramReview::class);
    }

    // post graduate programs have many post graduate program review applications
    public function postGraduateProgramReviewApplications()
    {
        return $this->belongsToMany(PostGraduateProgramReviewApplication::class, 'post_graduate_program_review_application_post_graduate_program');
    }
}
