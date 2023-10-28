<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShowDeskEvaluationRemarksRequest extends FormRequest
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
     *  ?deskEvaluation=10&criteria=12&standard=8
     *
     *  @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'desk_evaluation_id' => 'required|exists:desk_evaluations,id',
            'criteria_id' => 'required|exists:criterias,id',
            'standard_id' => ['required',
                Rule::exists('standards', 'id')->where(function ($query) {
                    $query->where('criteria_id', $this->criteria_id);
                })]
            ,
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'desk_evaluation_id' => $this->deskEvaluation,
                'criteria_id' => $this->criteria,
                'standard_id' => $this->standard,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'desk_evaluation_id.required' => 'Need to provide a desk evaluation id',
            'desk_evaluation_id.exists' => 'The desk evaluation id you provided does not exist',
            'criteria.required' => 'The criteria id is required in order to look up',
            'criteria_id.exits' => 'The requested criteria does not exist',
            'standard_id.required' => 'The standard id is required',
            'standard_id.exists' => 'There was no such standard under the given criteria',
        ];
    }
}
