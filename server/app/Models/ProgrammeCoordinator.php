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
}
