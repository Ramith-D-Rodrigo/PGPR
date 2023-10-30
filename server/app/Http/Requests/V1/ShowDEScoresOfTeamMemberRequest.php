<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShowDEScoresOfTeamMemberRequest extends FormRequest
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
     * IF POSSIBLE, CHECK FOR THE STATUS OF THE PE AND PGPR
     *
     * /{pgpr}/{reviewer}/{criteria}/{standard}
     *              or
     * /{pgpr}/{reviewer}
     *             or
     *  /{pgpr}/{reviewer}/{criteria}
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'reviewer_id' => 'required|exists:reviewers,id',
            'criteria_id' => 'sometimes|exists:criterias,id',
            'standard_id' => 'sometimes|exists:standards,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $data = [];
        $data['pgpr_id'] = $this->pgpr;
        $data['reviewer_id'] = $this->reviewer;

        if (isset($this->criteria)) {
            $data['criteria_id'] = $this->criteria;
        }

        if (isset($this->standard)) {
            $data['standard_id'] = $this->standard;
        }

        $this->merge($data);
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate program review id is required.',
            'pgpr_id.exists' => 'The post graduate program review does not exist in our database.',
            'reviewer_id.required' => 'The post graduate program review id is required.',
            'reviewer_id.exists' => 'The post graduate program review does not exist in our database.',
            'criteria_id.exists' => 'The criteria does not exist in our database',
            'standard_id.exists' => 'The standard does not exist in our database',
        ];
    }
}
