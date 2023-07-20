<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StorePostGraduateProgramRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //true for now
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slqf_level' => ['required', 'integer',], // 'min:1', 'max:8' set these later
            'commencement_year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y')+1)],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
            //'added_by_cqa_director_id' ,
            //'programme_coordinator_id'
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
    }
}