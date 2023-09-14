<?php

namespace App\Http\Requests\V1;

use App\Models\Faculty;
use App\Rules\V1\DeanExists;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Http\Requests\V1\StoreAcademicStaffRequest;

class StoreDeanRequest extends StoreAcademicStaffRequest
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

        $rules = parent::rules(); //get the rules from the parent class (AcademicStaff)

        $rules['assigned_date'] = ['required', 'date', 'before_or_equal:today'];
        //$rules['current_status'] = ['required', Rule::in(['ACTIVE', 'INACTIVE'])]; (current status is set by the system)
        //faculty id is required and should be an existing faculty id, moreover the faculty id should belongs to the university_id of the dean
        $rules['faculty_id'] = ['required', 'integer', Rule::exists('faculties', 'id')->where(function ($query) {
            $query->where('university_id', $this -> university_id);
        })];

        $rules['curr_dean'] = ['nullable', 'integer', new DeanExists()];

        return $rules;
    }

    public function messages() : array{
        $msgs = parent::messages(); //get the messages from the parent class (AcademicStaff)
        $thisMsgs = [
            'faculty_id.exists' => 'The faculty id should be an existing faculty id and it should belongs to the university of the dean',
            'faculty_id.required' => 'The faculty id is required',
            'faculty_id.integer' => 'The faculty id should be an integer',
            'assigned_date.required' => 'The assigned date is required',
            'assigned_date.date' => 'The assigned date should be a date',
            'assigned_date.before_or_equal' => 'The assigned date should be before or equal to today',
        ];

        return array_merge($msgs, $thisMsgs);
    }

    public function prepareForValidation(){
        parent::prepareForValidation();

        //merge university id from current logged in cqa director's university id
        $this -> merge([
            'university_id' => Auth::user() -> universitySide -> university_id
        ]);

        $this -> merge([
            'curr_dean' => Faculty::findOrFail($this -> faculty_id) -> dean_id //get the current dean of the faculty
        ]);
    }
}
