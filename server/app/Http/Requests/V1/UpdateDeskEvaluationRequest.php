<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeskEvaluationRequest extends FormRequest
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
            'id' => ['required', Rule::exists('desk_evaluations', 'id')->where(function ($query) {
                $query->where('status', 'ONGOING');
            })],
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => ['sometimes', Rule::in(['COMPLETED'])]
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
            'id.exists' => 'The desk evaluation id you have mentioned does not exists in out database or is not in an updatable state please check again and retry',
            'start_date.required' => 'You need to provide a start date for the desk evaluation process',
            'start_date.date' => 'You need to provide a date value for the start date',
            'start_date.after_or_equal' => 'The start date that you provided is in the past and cannot be used as a valid start date',
            'end_date.required' => 'You need to provide an end date for the desk evaluation',
            'end_date.date' => 'You need to provide a date value for the end date',
            'end_date.after_or_equal' => 'The end date you provided is older than the start date, which is not valid',
            'status.in' => 'You can only change the status of a desk evaluation to COMPLETED and the desk evaluation should be in ONGOING state to do this',
        ];
    }

}
