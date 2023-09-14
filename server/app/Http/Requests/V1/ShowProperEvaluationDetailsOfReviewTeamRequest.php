<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShowProperEvaluationDetailsOfReviewTeamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reviewer views PE details of review team
     * {
     *     reviewTeam: 12,
     *     pgpr: 1,
     * }
     *
     */

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'review_team_id' => [
                'required',
                Rule::exists('review_teams', 'id')->where(function ($query) {
                    $query->where('pgpr_id', $this->pgpr_id);
                })
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgpr,
                'review_team_id' => $this->reviewTeam,
            ]
        );
    }
}
