<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SetDatesForPE2Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

  /*
  * pgprId=10
  * startDate
  * siteVisitStartDate
  * siteVisitEndDate
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
                $query->where('status_of_pqpr', 'PE1');
            })],
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'site_visit_start_date' => 'required|date|after_or_equal:today',
            'site_visit_end_date' => 'required|date|after:site_visit_start_date',
            'remark' => 'sometimes|max:255'
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgprId,
                'start_date' => $this->startDate,
                'pe1_meeting_date' => $this->meetingDate,
                'site_visit_start_date' => $this->siteVisitStartDate,
                'site_visit_end_date' => $this->siteVisitEndDate,
                'end_date' => $this->endDate,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'You need to provide the post graduate review program id',
            'pgpr_id.exists' => 'The post graduate program review id you have mentioned does not exists in out database or is not in an updatable state please check again and retry',

            'start_date.required' => 'You need to provide a start date for the phase two of the proper evaluation process',
            'start_date.date' => 'You need to provide a date value for the start date of the proper evaluation phase two',
            'start_date.after_or_equal' => 'The start date that you provided is in the past and cannot be used as a valid start date of the proper evaluation phase two',

            'end_date.required' => 'You need to provide an end date for the phase two of the proper evaluation',
            'end_date.date' => 'You need to provide a date value for the end date of the proper evaluation phase two',
            'end_date.after' => 'The end date you provided is older than the start date of the proper evaluation phase two, which is not valid',

            'site_visit_start_date.required' => 'You need to provide an start date for the site visit in the phase two of the proper evaluation',
            'site_visit_start_date.date' => 'You need to provide a date value for the start date of the site visit of the proper evaluation phase two',
            'site_visit_start_date.after_or_equal' => 'The start date that you provided is in the past and cannot be used as a valid start date of the proper evaluation phase two',

            'site_visit_end_date.required' => 'You need to provide an end date for the site visit in the phase two of the proper evaluation',
            'site_visit_end_date.date' => 'You need to provide a date value for the end date of the site visit end date',
            'site_visit_end_date.after' => 'The end date you provided is older than the start date of the site visit start date, which is not valid',

            'remark.max' => 'A remark can only contain 255 characters'
        ];
    }
}
