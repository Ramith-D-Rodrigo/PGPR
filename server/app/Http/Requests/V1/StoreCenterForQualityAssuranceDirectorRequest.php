<?php

namespace App\Http\Requests\V1;

use App\Models\CenterForQualityAssurance;
use App\Models\University;
use App\Rules\V1\CQADirectorExists;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCenterForQualityAssuranceDirectorRequest extends StoreQualityAssuranceStaffRequest
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
        $parentRules = parent::rules();

        //center_for_quality_assurance_id is required and should exist in the center for quality assurance table
        $parentRules['center_for_quality_assurance_id'] = ['required', 'exists:center_for_quality_assurances,id'];
        $parentRules['center_for_quality_assurance_director_id'] = ['nullable', 'integer', new CQADirectorExists()];

        return $parentRules;
    }

    public function prepareForValidation(){
        //the frontend sends the university id as the center for quality assurance id, we need to find the center for quality assurance id from the university id
        $uniId = $this -> universityId;
        $university = University::findOrFail($uniId);

        $this -> merge([
            'centerForQualityAssuranceId' => $university -> center_for_quality_assurance_id,
            'centerForQualityAssuranceDirectorId' => $university -> CenterForQualityAssurance -> center_for_quality_assurance_director_id //this is the current center for quality assurance director id
        ]);

        //call the parent prepare for validation function for converting camel case to snake case
        parent::prepareForValidation();
    }


}
