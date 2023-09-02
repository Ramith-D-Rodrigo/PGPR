<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSERRemarksOfSectionsABDRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            //
            'ser_id' => ['required', 'exists:self_evaluation_reports,id'],
            'sections' => ['required', 'array', 'min:1', 'max:3'],
            'sections.*.section' => ['required', 'distinct', Rule::in(['A', 'B', 'C'])],
            'sections.*.remark' => ['required', 'max:255', 'min:10'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'ser_id' => $this->selfEvaluationReportId,
        ]);
    }

    public function messages(): array
    {
        return [
            'remark.required' => 'You should provide a remark',
            'remark.min' => 'The comment must be of at least 4 characters long.',
            'remark.max' => 'The comment cannot exceed 255 characters.',
        ];
    }
}
