<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProperEvaluationRequest extends FormRequest
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
            'id' => ['required', Rule::exists('proper_evaluations')->where(function ($query) {
                $query->whereIn('status', ['1', '2']);
            })],
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => ['sometimes', Rule::in(['1', '2', 'COMPLETED'])]
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'id' => $this->deskEvaluationId,
                'start_date' => $this->startDate,
                'end_date' => $this->endDate,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'id.required' => 'You need to provide the post graduate review program id',
            'id.exists' => 'The proper evaluation id you have mentioned does not exists in out database or is not in an updatable state please check again and retry',
            'start_date.required' => 'You need to provide a start date for the proper evaluation process',
            'start_date.date' => 'You need to provide a date value for the start date',
            'start_date.after_or_equal' => 'The start date that you provided is in the past and cannot be used as a valid start date',
            'end_date.required' => 'You need to provide an end date for the proper evaluation',
            'end_date.date' => 'You need to provide a date value for the end date',
            'end_date.after_or_equal' => 'The end date you provided is older than the start date, which is not valid',
            'status.in' => 'Status could only be one of the values 1, 2, or COMPLETED, please make amends',
        ];
    }
}
