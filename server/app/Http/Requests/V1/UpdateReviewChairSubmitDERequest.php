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
     * POST request +>
     *              {
     *                  pgpr: 10
     *              }
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
                    if ($pgpr->status_of_pgpr != 'DE') {
                        $fail('The post graduate program review is not in an updatable state.');
                    }
                }
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate program review id is required.',
            'pgpr_id.exists' => 'The post graduate program review does not exist in our database.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgpr,
            ]
        );
    }
}
