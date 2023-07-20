<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProgrammeCoordinatorRequest extends StoreAcademicStaffRequest
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
        $arr = parent::rules();

        $arr['post_grad_program_id'] = ['required', 'integer', 'exists:post_graduate_programs,id'];
        $arr['assigned_date'] = ['required', 'date', 'before_or_equal:today'];

        $arr['faculty_id'] = ['required', 'integer', Rule::exists('faculties', 'id')->where(function ($query) {
            $query->where('university_id', $this -> university_id);
        })];

        return $arr;
    }

    public function messages(): array {
        $msgs = parent::messages();

        $thisMsgs = [
            'post_grad_program_id.required' => 'The post graduate program id is required',
            'post_grad_program_id.integer' => 'The post graduate program id should be an integer',
            'post_grad_program_id.exists' => 'The post graduate program id should be an existing post graduate program id',
            'assigned_date.required' => 'The assigned date is required',
            'assigned_date.date' => 'The assigned date should be a date',
            'assigned_date.before_or_equal' => 'The assigned date should be before today or equal to today',
            'faculty_id.required' => 'The faculty id is required',
            'faculty_id.integer' => 'The faculty id should be an integer',
            'faculty_id.exists' => 'The faculty id should be an existing faculty id and it should belongs to the university of the programme coordinator',
        ];

        return array_merge($msgs, $thisMsgs);
    }
}
