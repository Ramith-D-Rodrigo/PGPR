<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowDEScoresOfReviewTeamRequest extends FormRequest
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
     * IF POSSIBLE, CHECK FOR THE STATUS OF THE DE AND PGPR
     *
     * /{pgpr}/{criteria}/{standard}
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'criteria_id' => 'required|exists:criterias,id',
            'standard_id' => 'required|exists:standards,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgpr,
                'criteria_id' => $this->criteria,
                'standard_id' => $this->standard,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate program review id is required.',
            'pgpr_id.exists' => 'The post graduate program review does not exist in our database.',
            'criteria_id.required' => 'The criteria id is required',
            'criteria_id.exists' => 'The criteria does not exist in our database',
            'standard_id.required' => 'The standard id is required',
            'standard_id.exists' => 'The standard does not exist in our database',
        ];
    }
}
