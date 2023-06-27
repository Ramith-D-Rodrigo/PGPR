<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;

class AcademicStaff extends Model
{
    use HasFactory;

    //academic staff is a university side
    public function universitySide(){
        return $this->belongsTo(UniversitySide::class, 'id', 'id');
    }

}
