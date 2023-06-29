<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;

class ViceChancellor extends Model
{
    use HasFactory;

    //vice chancellor is a university side
    public function universitySide(){
        return $this->belongsTo(UniversitySide::class);
    }

    // post graduate program can be recommended by the vice chancellor
    public function postGraduateProgramReviews()
    {
        return $this->hasMany(PostGraduateProgramReview::class, 'vice_chancellor_id');
    }
}
