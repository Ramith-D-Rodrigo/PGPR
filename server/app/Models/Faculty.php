<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dean_id',
        'website',
        'address',
        'contact_no',
        'fax_no',
        'university_id',
        'iqau_id', //not in the migration
    ];

    //faculty belongs to a university
    public function university(){
        return $this->belongsTo(University::class);
    }

    //faculty has many deans
    public function deans(){
        return $this->hasMany(Dean::class);
    }

    //but only one dean at a time
    public function currentDean(){
        return $this->hasOne(Dean::class, 'id', 'dean_id');
    }

    // Faculty has an Internal Quality Assurance Unit
    public function internalQualityAssuranceUnit()
    {
      return $this->hasOne(InternalQualityAssuranceUnit::class, 'iqau_id');
    }

    // Faculty has many postgraduate degree programs
    public function postGraduatePrograms()
    {
        return $this->hasMany(PostGraduateProgram::class, 'faculty_id');
    }

    // Program can have many ProgramCoordinators
    public function programCoordinators()
    {
        return $this->hasMany(ProgrammeCoordinator::class, 'faculty_id');
    }

    public function workingReviewers(){
        return $this -> hasMany(Reviewer::class, 'working_faculty');
    }
}
