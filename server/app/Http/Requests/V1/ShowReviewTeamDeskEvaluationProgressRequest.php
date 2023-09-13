<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowReviewTeamDeskEvaluationProgressRequest extends FormRequest
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
     *              reviewTeam=10&deskEvaluation=12
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'desk_evaluation_id' => 'required|exists:desk_evaluations,id',
            'review_team_id' => 'required|exists:review_teams,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'desk_evaluation_id.required' => 'The desk evaluation id is required',
                'desk_evaluation_id.exists' => 'The desk evaluation does not exist',
                'review_team_id.required' => 'The review team id is required',
                'review_team_id.exists' => 'The review team does not exist',
            ]
        );
    }
}
