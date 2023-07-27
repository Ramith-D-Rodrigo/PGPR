<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreInternalQualityAssuranceUnitDirectorRequest extends StoreQualityAssuranceStaffRequest
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

        $parentRules['iqau_id'] = ['required', 'exists:internal_quality_assurance_units,id'];

        return $parentRules;
    }

    public function messages(): array {
        $parentMsgs = parent::messages();

        $currMessages = [
            'iqau_id.required' => 'Internal quality assurance unit ID is required',
            'iqau_id.exists' => 'Internal quality assurance unit ID does not exist'
        ];

        return array_merge($parentMsgs, $currMessages);
    }

}
