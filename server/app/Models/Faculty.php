<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    //faculty belongs to a university
    public function university(){
        return $this->belongsTo(University::class);
    }

    //faculty has many deans
    public function deans(){
        return $this->hasMany(Dean::class);
    }

    // Faculty has an Internal Quality Assurance Unit
    public function internalQualityAssuranceUnit()
    {
      return $this->hasOne(InternalQualityAssuranceUnit::class);
    }

    // Faculty has many postgraduate degree programs
    public function postGraduatePrograms()
    {
        return $this->hasMany(PostGraduateProgram::class);
    }

    // Program can have many ProgramCoordinators
    public function programCoordinators()
    {
        return $this->hasMany(ProgrammeCoordinator::class);
    }
}
