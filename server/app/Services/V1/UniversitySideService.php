<?php
//this service class is used for services related to university side

namespace App\Services\V1;

use App\Models\UniversitySide;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\V1\UserService;
use Illuminate\Database\Eloquent\Model;

class UniversitySideService extends UserService{

    public static function create(array $validatedData) : Model {
        //make sure validatedData includes the status field, staff_position field
        $user = parent::create($validatedData); //call the parent create function to create the user

        $universitySide = new UniversitySide();
        $universitySide -> id = $user -> id;
        $universitySide -> fill($validatedData);

        $universitySide -> save();

        return $universitySide; //return the university side object
    }
}

