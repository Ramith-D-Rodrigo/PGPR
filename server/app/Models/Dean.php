<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dean extends Model
{
    use HasFactory;

    //dean is an academic staff
    public function academicStaff(){
        return $this->belongsTo(AcademicStaff::class);
    }

    //dean belongs to a faculty
    public function faculty(){
        return $this->belongsTo(Faculty::class);
    }
}
