<?php

//this service class is used for services related to users

namespace App\Services\V1;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;


class UserService {
    public static function create(array $validatedData) : Model {    //data should be validated in the controller before calling the function
        //make sure validatedData includes the status field
        $user = new User();

        $password = $validatedData['password'];

        $validatedData['password'] = Hash::make($validatedData['password']);
        $validatedData['roles'] = json_encode($validatedData['roles']); //convert the array to json string
        $user -> fill($validatedData);

        $user -> save();
        return $user; //return the user object and the password (password for sending the email)
    }
}
