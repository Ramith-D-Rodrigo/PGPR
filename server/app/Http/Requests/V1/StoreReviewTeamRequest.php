<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class StoreReviewTeamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: ONLY QAC OFFICER OR THE DIRECTOR CAN CREATE REVIEW TEAMS VALIDATION SHOULD BE IMPLEMENTED
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */

    /*
     *
     * TODO: NEED TO PROVIDE CUSTOM ERROR MESSAGES
     * THIS SHOULD BE THE FORMAT OF THE INCOMING DATA
     *  {
     *      pgprId: 10,
     *      reviewers:
     *          [
     *              {reviewId: 1, position: "MEMBER"},
     *              {reviewId: 2, position: "CHAIR"},
     *              {reviewId: 3, position: "MEMBER"}
     *          ]
     *  }
     */

    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'reviewers' => 'required|array|min:1|max:3',
            'reviewers.*.reviewer_id' => 'required|exists:reviewers,id',
            'reviewers.*.position' => ['required', Rule::in(['MEMBER', 'CHAIR'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'pgpr_id' => $this->pgprId,
            'reviewers' => Arr::map($this->reviewers, function ($reviewer) {
                return ["reviewer_id" => $reviewer["reviewerId"] ?? null, "position" => $reviewer["position"] ?? null];
            }),
        ]);
    }
}
