<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SetDatesForPE1Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /*
     * pgprId
     * startDate
     * meetingDate
     * endDate
     * remark
     */

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => ['required', Rule::exists('post_graduate_program_reviews', 'id')->where(function ($query) {
                $query->where('status_of_pgpr', 'PE1');
            })],
            'start_date' => 'required|date|after_or_equal:today',
            'pe_1_meeting_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'remark' => 'sometimes|max:255'
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgprId,
                'start_date' => $this->startDate,
                'pe_1_meeting_date' => $this->meetingDate,
                'end_date' => $this->endDate,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'You need to provide the post graduate review program id',
            'pgpr_id.exists' => 'The post graduate program review id you have mentioned does not exists in out database or is not in an updatable state please check again and retry',

            'start_date.required' => 'You need to provide a start date for the phase one of the proper evaluation process',
            'start_date.date' => 'You need to provide a date value for the start date of the proper evaluation phase one',
            'start_date.after_or_equal' => 'The start date that you provided is in the past and cannot be used as a valid start date of the proper evaluation phase one',

            'end_date.required' => 'You need to provide an end date for the phase one of the proper evaluation',
            'end_date.date' => 'You need to provide a date value for the end date of the proper evaluation phase one',
            'end_date.after' => 'The end date you provided is older than the start date of the proper evaluation phase one, which is not valid',

            'pe_1_meeting_date.required' => 'You need to provide a date for the the meeting conducted in the phase one of the proper evaluation process',
            'pe_1_meeting_date.after_or_equal' => 'The meeting date you provided is not valid, should a date in the future or today please make changes and retry',
            'pe_1_meeting_date.date' => 'You have to provide a date value for he meeting date',

            'remark.max' => 'A remark can only contain 255 characters'
        ];
    }
}
