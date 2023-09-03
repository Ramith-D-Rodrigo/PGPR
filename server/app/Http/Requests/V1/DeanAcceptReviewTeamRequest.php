<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeanAcceptReviewTeamRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'required|exists:review_teams,id',
            'remark' => 'sometimes|min:4|max:255'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'id' => $this->reviewTeamId,
                'dean_decision' => 'ACCEPTED',
            ]
        );
    }

    public function messages(): array
    {
        return [
            'id.required' => 'Need the review team id inorder to record the response.',
            'id.exists' => 'There is no such review team in our records.',
            'remark.min' => 'The comment must be of at least 4 characters long.',
            'remark.max' => 'The comment cannot exceed 255 characters.',
        ];
    }
}
