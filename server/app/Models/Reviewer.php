<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reviewer extends Model
{
    use HasFactory;

    //reviewer is an academic staff

    public function academicStaff(){
        return $this->belongsTo(AcademicStaff::class);
    }
}
