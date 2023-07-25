<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreCenterForQualityAssuranceRequest extends StoreUniversitySideRequest
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
        $parentRules['center_for_quality_assurance_id'] = ['required', 'exists:centers_for_quality_assurance,id'];

        return $parentRules;
    }


    public function messages(): array{
        $parentMsgs = parent::messages();

        $currMessages = [
            'center_for_quality_assurance_id.required' => 'Center for quality assurance ID is required',
            'center_for_quality_assurance_id.exists' => 'Center for quality assurance ID does not exist'
        ];

        return array_merge($parentMsgs, $currMessages);
    }
}
