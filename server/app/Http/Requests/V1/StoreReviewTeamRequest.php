<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array|string>
     */
    // protected $stopOnFirstFailure = true;

    /*
     *
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
            'reviewers.*.reviewer_id' => 'required|distinct|exists:reviewers,id',
            'reviewers.*.position' => ['required', Rule::in(['MEMBER', 'CHAIR'])],
        ];
    }

    function messages(): array
    {
        return [
            'pgpr_id.required' => 'We need to know the postgraduate program in order to assign a new review team.',
            'pgpr_id.exists' => 'There is no such postgraduate program in our database.',
            'reviewers.required' => 'Need to know the reviewers you are assigning.',
            'reviewers.array' => 'Reviewers should be sent in an array.',
            'reviewers.min' => 'Seems like there are no reviewers to add, please check and retry.',
            'reviewers.max' => 'Sorry, you can only add at most 3 three reviewers per review team.',
            'reviewers.*.reviewer_id.required' => 'You have not provided an id for the reviewer #:position, please check and get back.',
            'reviewers.*.reviewer_id.distinct' => 'The #:position reviewer is duplicated, please check and get back.',
            'reviewers.*.reviewer_id.exists' => 'The reviewer #:position that you provided do not exist in our database.',
            'reviewers.*.position.required' => 'You have not provided the role of the reviewer #:position, please check and get back.',
            'reviewers.*.position.rule' => 'The position that you provided for the reviewer #:position is not valid, it could only be either chair or member.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'pgpr_id' => $this->pgprId,
            'reviewers' => Arr::map($this->reviewers, function ($reviewer) {
                return [
                    "reviewer_id" => $reviewer["reviewerId"] ?? null,
                    "position" => $reviewer["position"] ? $reviewer["position"] == 'member' ? 'MEMBER' :
                        ($reviewer["position"] == 'chair' ? 'CHAIR' :
                            $reviewer["position"]) :
                        null
                ];
            }),
        ]);
    }
}
