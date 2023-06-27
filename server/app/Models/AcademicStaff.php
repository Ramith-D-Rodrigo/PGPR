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

    //academic staff can be a reviewer or a programme coordinator or a dean (or multiple of these)
    public function reviewer(){
        return $this->hasOne(Reviewer::class);
    }

    public function programmeCoordinator(){
        return $this->hasOne(ProgrammeCoordinator::class);
    }

    public function dean(){
        return $this->hasOne(Dean::class);
    }

}
