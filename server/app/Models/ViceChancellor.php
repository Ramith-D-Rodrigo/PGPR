<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;

class ViceChancellor extends UniversitySide
{
    use HasFactory;

    //vice chancellor is a university side
    public function universitySide(){
        return $this->belongsTo(UniversitySide::class);
    }
}
