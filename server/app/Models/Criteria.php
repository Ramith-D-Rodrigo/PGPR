<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    use HasFactory;

    //1 to many relationship between criteria and standards
    public function standards(){
        return $this -> hasMany(Standard::class);
    }
}
