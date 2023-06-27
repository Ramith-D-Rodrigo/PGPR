<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    //faculty belongs to a university
    public function university(){
        return $this->belongsTo(University::class);
    }

    //faculty has many deans
    public function deans(){
        return $this->hasMany(Dean::class);
    }
}
