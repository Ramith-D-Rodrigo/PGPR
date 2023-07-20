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
        return false;
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
            'year_2' => ['required', 'string'],
            'year_3' => ['required', 'string'],
            'year_4' => ['required', 'string'],
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
            'y_end.required' => 'End Date is required',
            'post_graduate_program_id.required' => 'Post graduate program id is required',
            'post_graduate_program_id.exists' => 'Post graduate program id does not exist',
            'post_graduate_program_id.integer' => 'Post graduate program id must be an integer',
        ];
    }
}
