<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowStandardWiseDetailsOfEachCriteriaRequest extends FormRequest
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
     * GET request
     *  +> criteria=10&deskEvaluation=12
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'desk_evaluation_id' => 'required|exists:desk_evaluations,id',
            'criteria_id' => 'required|exists:criterias,id'
        ];
    }

    public function messages(): array
    {
        return [
            'desk_evaluation_id.required' => 'The desk evaluation id is required',
            'desk_evaluation_id.exists' => 'The desk evaluation does not exists in our database',
            'criteria_id.required' => 'The criteria id is required',
            'criteria_is.exists' => 'The criteria does not exists in our database',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'desk_evaluation_id' => $this->deskEvaluation,
            'criteria_id' => $this->criteria,
        ]);
    }
}
