<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgrammeCoordinator extends Model
{
    use HasFactory;

    //programme coordinator is an academic staff
    public function academicStaff(){
        return $this->belongsTo(AcademicStaff::class);
    }

    // program coordinator belongs to a post graduate program
    public function postGraduatePrograms()
    {
        return $this->belongsTo(PostGraduateProgram::class, 'post_grad_program_id', 'id');
    }

}
