<?php

namespace App\Http\Requests\V1;

use App\Models\DeskEvaluation;
use App\Models\PostGraduateProgramReview;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewChairSubmitDERequest extends FormRequest
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
     * GET request +>
     *              /{pgpr}/{deskEvaluation}
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => [
                'required',
                'exists:post_graduate_program_reviews,id',
                function ($attribute, $value, $fail) {
                    $pgpr = PostGraduateProgramReview::find($value);
                    if ($pgpr->state != 'DE') {
                        $fail('The post graduate program review is not in an updatable state.');
                    }
                }
            ],
            'desk_evaluation_id' => [
                'required',
                'exists:desk_evaluations,id',
                function ($attribute, $value, $fail) {
                    $deskEvaluation = DeskEvaluation::find($value);
                    if ($deskEvaluation->state != 'ONGOING') {
                        $fail('The desk evaluation is not in an updatable state.');
                    }
                }
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate program review id is required.',
            'pgpr_id.exists' => 'The post graduate program review does not exist in our database.',
            'desk_evaluation_id.required' => 'The desk evaluation id is required',
            'desk_evaluation_id.exists' => 'The desk evaluation does not exist in our database',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgpr,
                'desk_evaluation_id' => $this->deskEvaluation,
            ]
        );
    }
}
