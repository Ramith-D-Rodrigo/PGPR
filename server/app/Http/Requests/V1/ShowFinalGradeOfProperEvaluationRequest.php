<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShowFinalGradeOfProperEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     *
     * GET request +>
     *              {
     *                  pgpr: 10
     *              }
     *
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => ['required', Rule::exists('post_graduate_program_reviews', 'id')->where(function ($query) {
                $query->whereNotIn('status_of_pgpr', ['PLANNING', 'SUBMITTED', 'SUSPENDED', 'DE']);
            })]
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'pgpr_id' => $this->pgpr
        ]);
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate program id is required.',
            'pgpr_id.exists' => 'There is no such a post graduate review program in our system or, the review process has not yet reach a level the grades can be viewed.',
        ];
    }
}
