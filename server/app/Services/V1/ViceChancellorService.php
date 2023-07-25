<?php

namespace App\Services\V1;

use App\Models\ViceChancellor;
use Illuminate\Database\Eloquent\Model;

class ViceChancellorService extends UniversitySideService {
    public static function create(array $validatedData): Model{
        //make sure validated data has status, and roles field, vc_status field
        $universitySide = parent::create($validatedData); //call the parent create function to create the and get the university side model

        $viceChancellor = new ViceChancellor();

        $viceChancellor -> fill($validatedData);
        $viceChancellor -> id = $universitySide -> id;

        $viceChancellor -> save();

        return $viceChancellor; //return the vice chancellor object and the password (password for sending the email)

    }
}
