<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReviewerSubmitDeskEvaluation extends FormRequest
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
     *               deskEvaluation=10
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'desk_evaluation_id' => 'required|exists:desk_evaluations,id'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'desk_evaluation_id' => $this->deskEvaluation
            ]
        );
    }

    public function messages(): array
    {
        return [
            'desk_evaluation_id.required' => 'The desk evaluation id is required',
            'desk_evaluation_id.exists' => 'The desk evaluation does not exist',
        ];
    }
}
