<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReviewerSubmitProperEvaluation extends FormRequest
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
     *  POST request +>
     *               properEvaluation=10
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'proper_evaluation_id' => 'required|exists:proper_evaluations,id'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'proper_evaluation_id' => $this->properEvaluation
            ]
        );
    }

    public function messages(): array
    {
        return [
            'proper_evaluation_id.required' => 'The proper evaluation id is required',
            'proper_evaluation_id.exists' => 'The proper evaluation does not exist',
        ];
    }
}
