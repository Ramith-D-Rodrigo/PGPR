<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowOwnDeskEvaluationCriteriaWiseRequest extends FormRequest
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
     *              deskEvaluation=12&criteria=10
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'desk_evaluation_id' => 'required|exists:desk_evaluations,id',
            'criteria_id' => 'sometimes|exists:criterias,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $data = [
            'desk_evaluation_id' => $this->deskEvaluation,
        ];

        if (isset($this->criteria)) {
            $data['criteria_id'] = $this->criteria;
        }

        $this->merge($data);
    }

    public function messages(): array
    {
        return [
            'desk_evaluation_id.required' => 'The desk evaluation id is required',
            'desk_evaluation_id.exists' => 'The desk evaluation does not exist in the database',
            'criteria_id.exists' => 'The criteria does not exists in the database',
        ];
    }
}
