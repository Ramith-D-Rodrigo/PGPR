<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Standard extends Model
{
    use HasFactory;

    //1 to many relationship between criteria and standards
    public function criteria(){
        return $this -> belongsTo(Criteria::class);
    }
}
