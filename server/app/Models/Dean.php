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
}
