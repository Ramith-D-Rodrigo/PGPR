<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowRemarksOfSERRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ser_id' => ['required', 'exists:self_evaluation_reports,id'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'ser_id' => $this->serId,
        ]);
    }

    public function messages(): array
    {
        return [
            'ser_id.required' => 'You need to provide the ID of the Self evaluation report that you are updating',
            'ser_id.exists' => 'There was no such self evaluation report amongst our records please check again and retry',
        ];
    }
}

