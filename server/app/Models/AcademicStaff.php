<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;

class AcademicStaff extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'designation',
        'experience_in_industry',
        'google_scholar_link',
        'nominees',
        'department',
        'experience_with_research_funds',
        'supervised_postgraduate_student_count',
        'publications_in_referred_journals_count',
        'abstract_count',
        'conference_preceedings_count',
        'book_chapters',
        'involvement_in_internal_quality_assurance',
        'involment_in_study_programme_development',
        'postgraduate_teaching_experience',
        'postgraduate_qualifications',
        'prior_training_in_programme_review',
        'cv'
    ];

    //academic staff is a university side
    public function universitySide(){
        return $this->belongsTo(UniversitySide::class, 'id', 'id');
    }

    //academic staff can be a reviewer or a programme coordinator or a dean (or multiple of these)
    public function reviewer(){
        return $this->hasOne(Reviewer::class);
    }

    public function programmeCoordinator(){
        return $this->hasOne(ProgrammeCoordinator::class);
    }

    public function dean(){
        return $this->hasOne(Dean::class, 'id', 'id');
    }

}
