<?php

namespace App\Http\Requests\V1;

use App\Models\Faculty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StorePostGraduateProgramRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'slqf_level' => ['required', 'integer', 'min:5', 'max:12'],
            'commencement_year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y')+1)],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
            'is_professional_pg_programme' => ['required', 'boolean'],
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
