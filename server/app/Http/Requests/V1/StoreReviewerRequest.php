<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewerRequest extends StoreAcademicStaffRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array{
        $parentRules = parent::rules(); //get the rules from the parent class (StoreAcademicStaffRequest)
        $thisRules = ['working_faculty' => [
            'required',
            'exists:faculties,id',
            'integer'
        ]];

        return array_merge($parentRules, $thisRules);
    }

    public function messages(): array{
        $parentMsgs = parent::messages(); //get the messages from the parent class (StoreAcademicStaffRequest)

        $currMessages = [
            'working_faculty.required' => 'Working faculty is required',
            'working_faculty.exists' => 'Working faculty does not exist',
            'working_faculty.integer' => 'Working faculty should be an integer'
        ];

        return array_merge($parentMsgs, $currMessages);
    }

    public function prepareForValidation(){
        //all parent class fields are converted to snake case
        parent::prepareForValidation();
    }

}
