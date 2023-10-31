<?php

namespace App\Services\V1;

use App\Models\ViceChancellor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

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

    public static function removeRole(ViceChancellor $vc, $termDate) : bool{
        if($termDate == null){
            $vc -> update(['vc_status' => 'INACTIVE']);
        }
        else{
            $vc -> update(['vc_status' => 'INACTIVE', 'term_date' => $termDate]);
        }

        //remove the vice_chanellor_id from the university table
        $vc -> university -> update(['vice_chancellor_id' => null]);

        //remove the vice_chancellor role from the user table
        $user = $vc -> universitySide -> user;

        //get the roles json column
        $roles = json_decode($user -> roles);

        //remove the vice_chancellor role from the roles array
        $roles = array_diff($roles, ['vice_chancellor']);

        //update the roles column
        $user -> update(['roles' => json_encode($roles)]);

        return true;
    }
}
