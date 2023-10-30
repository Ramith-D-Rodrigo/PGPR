<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class AssignReviewerRoleRequest extends FormRequest
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
        //get the universitySide from the called route
        $universitySide = $this -> route('universitySide');

        $roles = json_decode($universitySide -> user -> roles, true);

        if(in_array('dean', $roles) || in_array('programme_coordinator', $roles)){
            return [];
        }
        else{
            return [
                'google_scholar_link' => ['required', 'string', 'url'],
                'designation' => ['required', 'string'],
                'qualification_1' => ['required', 'string', 'max:255'],
                'qualification_1_slqf_level' => ['required', 'integer'],
                'qualification_2' => ['required', 'string', 'max:255'],
                'qualification_2_slqf_level' => ['required', 'integer'],
                'qualification_3' => ['string', 'max:255', 'present', 'nullable'],
                'qualification_3_slqf_level'=> ['integer', 'present', 'nullable'],
                'qualification_4' => ['string', 'max:255', 'present', 'nullable'],
                'qualification_4_slqf_level' => ['integer', 'present', 'nullable'],
                'working_faculty' => ['required', 'integer', 'exists:faculties,id'],
            ];
        }
    }

    public function prepareForValidation() {
        //convert camel case to snake case
        $fieldsWithVals = $this -> all();
        $newFieldsWithVals = [];
        foreach($fieldsWithVals as $key => $val){
            $newFieldsWithVals[Str::snake($key)] = $val;
        }

        $this -> replace($newFieldsWithVals); //replace the fields with snake case fields (the new fields)
    }
}
