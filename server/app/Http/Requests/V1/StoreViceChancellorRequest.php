<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreViceChancellorRequest extends StoreUniversitySideRequest
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

        $parentRules['appointed_date'] = ['required', 'date', 'before:today'];
        //term date is optional for now

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
    }
}
