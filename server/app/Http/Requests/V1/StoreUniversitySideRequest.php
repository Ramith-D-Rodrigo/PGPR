<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUniversitySideRequest extends StoreUserRequest //because university side is a user
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
        $rulesArr = parent::rules(); //get the rules from the parent class (StoreUserRequest)

        //add the rules for university side
        $rulesArr['university_id'] = ['required', 'exists:universities,id'];
        //staff_position is added via the system

        return $rulesArr;
    }

    public function prepareForValidation(){

        //all parent class fields are converted to snake case
        parent::prepareForValidation();
    }

    public function messages() : array {
        $parentMsgs = parent::messages(); //get the messages from the parent class (StoreUserRequest)

        $currMessages = [
            'university_id.required' => 'University ID is required',
            'university_id.exists' => 'University ID does not exist',
        ];

        return array_merge($parentMsgs, $currMessages);
    }
}
