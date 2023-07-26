<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreQualityAssuranceStaffRequest extends StoreUniversitySideRequest
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

        $parentRules['assigned_date'] = ['required', 'date', 'before_or_equal:today'];

        return $parentRules;
    }

    public function messages(): array {
        $parentMsgs = parent::messages();

        $currMessages = [
            'assigned_date.required' => 'Assigned date is required',
            'assigned_date.date' => 'Assigned date should be a date',
            'assigned_date.before_or_equal' => 'Assigned date should be before or equal to today'
        ];

        return array_merge($parentMsgs, $currMessages);
    }
}
