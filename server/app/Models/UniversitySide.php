<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class UniversitySide extends User
{
    use HasFactory;

    //university side is a user
    public function user(){
        return $this -> belongsTo(User::class);
    }
}
