<?php

namespace App\Http\Requests\V1;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        //all emails in the system
        $officialEmails = User::select('official_email') -> get() -> pluck('official_email') -> toArray();
        $personalEmails = User::select('personal_email') -> get() -> pluck('personal_email') -> toArray();

        $allEmails = array_merge($officialEmails, $personalEmails);

        return [
            //
            'initials' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'json'],
            'profile_pic' => ['required', 'string', 'max:255'], //need to change to file image
            'full_name' => ['required', 'string', 'max:255'],
            'official_telephone_no' => ['required', 'string', 'max:255'],
            'nic' => ['required', 'unique:users,nic'],
            'gender' => ['required', Rule::in('m', 'f')],
            'official_email' => ['required', 'string', 'email',
                //email should be unique in users table (both official_email and personal_email)
                Rule::notIn(...$allEmails)],
            'personal_email' => ['required', 'string', 'email',
                //email should be unique in users table (both official_email and personal_email)
                Rule::notIn(...$allEmails)],
        ];
    }

    public function prepareForValidation(){
        //convert all fields to snake case
        $fieldsWithVals = $this -> all();
        $newFieldsWithVals = [];
        foreach($fieldsWithVals as $key => $val){
            $newFieldsWithVals[Str::snake($key)] = $val;
        }

        $this -> replace($newFieldsWithVals); //replace the fields with snake case fields (the new fields)

        //convert contactNo to json
        if($this -> has('contact_no') and $this -> contact_no !== 'null'){ //if contact_no is given and not null
            $this -> merge([
                'contact_no' => json_encode($this -> contact_no)
            ]);
        }
    }

}
