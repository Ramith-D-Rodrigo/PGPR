<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StorePostGraduateProgramReviewApplicationRequest extends FormRequest
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
            'year_1' => ['required', 'string'],
            //year_2 should be greater than year_1
            'year_2' => ['required', 'string', 'gt:year_1'],
            //year_3 should be greater than year_2
            'year_3' => ['required', 'string', 'gt:year_2'],
            //year_4 should be greater than year_3
            'year_4' => ['required', 'string', 'gt:year_3'],
            //year_5 should be greater than year_4
            'year_5' => ['required', 'string', 'gt:year_4'],
            //y_end should be greater than year_5
            'y_end' => ['required', 'date'],
            'post_graduate_program_id' => ['required', 'integer', 'exists:post_graduate_programs,id'],

            //dean id is taken from the session, moreover post graduate program id should be an id that belongs to faculty of the dean (later this will be added)
        ];
    }

    public function prepareForValidation(){
        //convert camel case keys to snake case
        $objProps = $this -> all();

        foreach($objProps as $key => $value){
            $this -> merge([
                Str::snake($key) => $value
            ]);
        }
    }

    public function messages(){
        return [
            'year_1.required' => 'Year 1 is required',
            'year_2.required' => 'Year 2 is required',
            'year_3.required' => 'Year 3 is required',
            'year_4.required' => 'Year 4 is required',
            'year_5.required' => 'Year 5 is required',
            'y_end.required' => 'Evidences referencing date is required',
            'y_end.after' => 'Evidences referencing date should be after year 5',
            'y_end.date' => 'Evidences referencing date should be a date',
            'post_graduate_program_id.required' => 'Post graduate program id is required',
            'post_graduate_program_id.exists' => 'Post graduate program id does not exist',
            'post_graduate_program_id.integer' => 'Post graduate program id must be an integer',
        ];
    }
}
