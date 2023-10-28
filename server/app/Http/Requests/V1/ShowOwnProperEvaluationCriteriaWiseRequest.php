<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowOwnProperEvaluationCriteriaWiseRequest extends FormRequest
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
     * GET request +>
     *              pgpr=8&properEvaluation=12&criteria=10
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'proper_evaluation_id' => 'required|exists:proper_evaluations,id',
            'criteria_id' => 'sometimes|exists:criteria,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgpr,
                'proper_evaluation_id' => $this->properEvaluation,
                'criteria_id' => $this->criteria,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate program review id is required',
            'pgpr_id.exists' => 'The post graduate program review does not exist',
            'proper_evaluation_id.required' => 'The proper evaluation id is required',
            'proper_evaluation_id.exists' => 'The proper evaluation does not exist in the database',
            'criteria_id.exists' => 'The criteria does not exists in the database',
        ];
    }
}
