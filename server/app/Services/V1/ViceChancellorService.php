<?php

namespace App\Services\V1;

use App\Models\ViceChancellor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ViceChancellorService extends UniversitySideService {
    public static function create(array $validatedData): Model{
        //make sure validated data has status, and roles field, vc_status field

        //add the authorized qac officer id to the validated data
        $validatedData['created_by'] = Auth::user()->id;

        $universitySide = parent::create($validatedData); //call the parent create function to create the and get the university side model

        $viceChancellor = new ViceChancellor();

        $viceChancellor -> fill($validatedData);
        $viceChancellor -> id = $universitySide -> id;

        $viceChancellor -> save();

        return $viceChancellor; //return the vice chancellor object and the password (password for sending the email)

    }
}
