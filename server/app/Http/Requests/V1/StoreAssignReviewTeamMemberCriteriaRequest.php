<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StoreAssignReviewTeamMemberCriteriaRequest extends FormRequest
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
     *  Review team chair person can assign criteria to a review team member
     *  in the proper evaluation
     *
     *  {
     *      reviewTeamId: 10,
     *      reviewers: [
     *          {
     *              reviewerId: 10,
     *              criteria: [ 10, 17 ]
     *          },
     *          {
     *               reviewerId: 14,
     *               criteria: [ 14, 12 ]
     *           }
     *      ]
     *  }
     *
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'review_team_id' => [
                'required',
                Rule::exists('review_teams', 'id')->where(function ($query) {
                    $query->where('status', 'ACCEPTED');
                }),
                function ($attribute, $value, $fail) {
                    $reviewTeamId = $this->input('reviewTeamId');
                    $exists = DB::table('reviewer_review_teams')
                        ->where('reviewer_id', Auth::id())
                        ->where('role', 'CHAIR')
                        ->where('reviewer_confirmation', 'ACCEPTED')
                        ->exists();
                    if (!$exists) {
                        $fail("You are not the chair person of the review team $reviewTeamId, not authorized to make this request.");
                    }
                }
            ],
            'reviewers' => 'required|array|min:1|max:3',
            'reviewers.*.reviewer_id' => [
                'required',
                Rule::exists('reviewers', 'id')->where(function ($query) {
                }),
                function ($attribute, $value, $fail) {
                    $reviewTeamId = $this->input('reviewTeamId');
                    $exists = DB::table('reviewer_review_teams')
                        ->where('review_team_id', $reviewTeamId)
                        ->where('reviewer_id', $value)
                        ->where('reviewer_confirmation', 'ACCEPTED')
                        ->exists();
                    if (!$exists) {
                        $fail($attribute." is not in the review team with the id $reviewTeamId.");
                    }
                }
            ],
            'reviewers.*.criteria' => 'required|array|min:1|max:3',
            'reviewers.*.criteria.*' => 'required|exists:criterias,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $reviewers = [];

        foreach ($this->reviewers as $reviewer) {
            $reviewers[] = [
               'reviewer_id' => $reviewer['reviewerId'],
               'criteria' => $reviewer['criteria']
            ];
        }

        $this->merge(
            [
                'review_team_id' => $this->reviewTeamId,
                'reviewers' => $reviewers
            ]
        );
    }
}
