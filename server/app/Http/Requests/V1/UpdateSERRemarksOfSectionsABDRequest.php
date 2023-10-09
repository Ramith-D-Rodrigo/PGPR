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
            //
            'ser_id' => ['required', 'exists:self_evaluation_reports,id'],
            'sections' => ['required', 'array', 'min:1', 'max:3'],
            'sections.*.section' => ['required', 'distinct', Rule::in(['A', 'B', 'D'])],
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
            'ser_id.required' => 'You need to provide the ID of the Self evaluation report that you are updating',
            'ser_id.exists' => 'There was no such self evaluation report amongst our records please check again and retry',
            'sections.*.remark.required' => 'You should provide a remark for the sections that you are updating',
            'sections.*.remark.min' => 'The remark must be of at least 10 characters long.',
            'sections.*.remark.max' => 'The remark cannot exceed 255 characters.',
        ];
    }
}
