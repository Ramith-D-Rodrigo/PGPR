<?php

namespace App\Http\Requests\V1;

use App\Models\University;
use App\Rules\V1\ViceChancellorExists;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreViceChancellorRequest extends StoreUniversitySideRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //only qac officer can create vice chancellor
        $qacOfficer = Auth::user() -> qualityAssuranceCouncilOfficer ?? null;
        return $qacOfficer !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $parentRules = parent::rules();

        $parentRules['appointed_date'] = ['required', 'date', 'before:today'];
        //term date is optional for now

        //the vice chancellor id should be null (it will be set by the system. this is used to determine if the university has a vice chancellor or not)
        //if the vice chancellor id is not null, then the university already has a vice chancellor
        //so we cannot create another one
        $parentRules['vice_chancellor_id'] = ['nullable','integer', new ViceChancellorExists()];

        return $parentRules;
    }

    public function messages(): array {
        $parentMessages = parent::messages();

        $parentMessages['appointed_date.before'] = 'Appointed date cannot be a future date';
        $parentMessages['appointed_date.required'] = 'Appointed date is required';
        $parentMessages['appointed_date.date'] = 'Appointed date should be a valid date';

        return $parentMessages;
    }

    public function prepareForValidation(){
        parent::prepareForValidation();

        //there cannot be two vice chancellors at the same time
        //we can get the current vice chancellor from the university model
        //find the university from the request
        $university = University::findOrFail($this -> university_id);
        $this -> merge([
            'vice_chancellor_id' => $university -> vice_chancellor_id,
        ]);
    }
}
