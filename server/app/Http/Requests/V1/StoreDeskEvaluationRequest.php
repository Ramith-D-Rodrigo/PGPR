<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeskEvaluationRequest extends FormRequest
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
            'pgpr_id' => ['required', Rule::exists('post_graduate_program_reviews')->where(function ($query) {
                $query->whereIn('status_of_pgpr', ['DE', 'SUBMITTED', 'PLANNING']);
            })],
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgprId,
                'start_date' => $this->start_date,
                'end_date' => $this->end_date,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required',
            'pgpr_id.exists' => 'The postgraduate program id you have mentioned does not exists in out database or is not in an updatable state please check again and retry',
            'start_date.required' => 'You need to provide a start date for the desk evaluation process',
            'start_date.date' => 'You need to provide a date value for the start date',
            'start_date.after_or_equal' => 'The start date that you provided is in the past and cannot be used as a valid start date',
            'end_date.required' => 'You need to provide an end date for the desk evaluation',
            'end_date.date' => 'You need to provide a date value for the end date',
            'end_date.after_or_equal' => 'The end date you provided is older than the start date, which is not valid',
        ];
    }
}
