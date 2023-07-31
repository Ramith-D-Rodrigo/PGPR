<?php

//this service class is used for services related to users

namespace App\Services\V1;

use App\Mail\sendPassword;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UserService {
    public static function create(array $validatedData) : Model {    //data should be validated in the controller before calling the function
        //make sure validatedData includes the status field and the roles field
        $user = new User();
        $validatedData['roles'] = json_encode($validatedData['roles']); //convert the array to json string

        //add the authorized user who creates the account to the validated data
        $validatedData['created_by'] = Auth::user()->id;
        $user -> fill($validatedData);

        $user -> save();
        return $user; //return the user object and the password (password for sending the email)
    }

    public static function sendAccountCreateMail(array $validatedData, string $password){   //throws an exception to catch in the controller
        $user = [
            'surname' => $validatedData['surname'],
            'initials' => $validatedData['initials'],
            'password' => $password,
            'roles' => $validatedData['roles'],
            'official_email' => $validatedData['official_email'],
        ];
        Mail::to($validatedData['official_email']) -> send(new sendPassword($user, 'Created Account for Postgraduate Programme Review System', 'mail.userAccountPassword'));
    }
    public static function storeFiles(array $validatedData){
        //user has profile_pic as a file to store in the system storage
        $profilePic = $validatedData['profile_pic'];
        if($profilePic){
            $ext = $profilePic -> getClientOriginalExtension();
            $profilePictureName = $validatedData['official_email'] . '.' . $ext;

            //create the profile picture directory if it does not exist
            if(!File::exists(public_path('storage/profile_pics'))){
                File::makeDirectory(public_path('storage/profile_pics'));
            }

            Storage::put('public/profile_pics/' . $profilePictureName, $profilePic -> getContent());

            //get the profile picture url
            $profilePictureUrl = Storage::url('public/profile_pics/' . $profilePictureName);
            $validatedData['profile_pic'] = $profilePictureUrl;
        }

        return $validatedData;
    }
}
