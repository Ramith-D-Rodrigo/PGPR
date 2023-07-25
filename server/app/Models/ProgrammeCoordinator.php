<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgrammeCoordinator extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'post_grad_program_id',
        'assigned_date',
        'current_status'
    ];

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
