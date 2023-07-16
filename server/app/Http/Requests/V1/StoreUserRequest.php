<?php

namespace App\Http\Requests\V1;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

use function PHPUnit\Framework\isEmpty;

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
            'official_email' => ['required', 'string', 'email','unique:registered_emails,email'],
            'personal_email' => ['required', 'string', 'email','unique:registered_emails,email'],
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

    public function messages() : array{
        return [
            'initials.required' => 'Initials is required',
            'surname.required' => 'Surname is required',
            'contact_no.required' => 'Contact number is required',
            'contact_no.json' => 'Contact number should be a json string',
            'profile_pic.required' => 'Profile picture is required',
            'full_name.required' => 'Full name is required',
            'official_telephone_no.required' => 'Official telephone number is required',
            'nic.required' => 'NIC is required',
            'nic.unique' => 'NIC is already used in this system',
            'gender.required' => 'Gender is required',
            'gender.in' => 'Gender should be either m or f',
            'official_email.required' => 'Official email is required',
            'official_email.email' => 'Official email should be a valid email',
            'official_email.not_in' => 'Official email is already used in this system',
            'official_email.string' => 'Official email should be a string',
            'personal_email.required' => 'Personal email is required',
            'personal_email.email' => 'Personal email should be a valid email',
            'personal_email.not_in' => 'Personal email is already used in this system',
        ];
    }
}
