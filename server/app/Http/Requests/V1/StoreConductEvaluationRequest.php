<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreConductEvaluationRequest extends FormRequest
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
     *  Use case 1.3
     *  Conduct desk evaluation
     *
     *       {
     *           pgprId: 10,
     *           criteriaId: 10,
     *           standardId: 10,
     *           observations: "This is marvelous",
     *           score: 0 <= x <= 3
     *       }
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'criteria_id' => 'required|exists:criterias,id',
            'standard_id' => 'required|exists:standards,id',
            'comment' => 'required|max:255',
            'de_score' => 'required|integer|between:0,3',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgprId,
                'criteria_id' => $this->criteriaId,
                'standard_id' => $this->standardId,
                'comment' => $this->observations,
                'de_score' => $this->score,
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'You need to sent the post graduate review program id, otherwise we cannot find the proper review program',
            'pgpr_id.exists' => 'The postgraduate program review id that you provided does not exists in our database, please check and retry',
            'criteria_id.required' => 'We need to know which criteria you are evaluating, please send the criteria id',
            'criteria_id.exists' => 'The criteria id that you provided does not exist in our database, please check and get back',
            'standard_id.required' => "We need to know which standard of the criteria {$this->criteriaId} you are evaluating, please include the standard id",
            'standard_id.exists' => 'The standard id that you provided is not a valid standard of the criteria that you provided, please check and retry',
            'observations.required' => 'We need your valuable observations please include them, will be easy for you as well',
            'observations.max' => 'The maximum length of the observations text is limited to 255 characters. please make sure you do not go over the limit',
            'de_score.required' => 'You need to give a  score for this evaluation',
            'de_score.integer' => 'The score must be a number, in fact it should be an integer',
            'de_score.between' => 'The score must be a value between 0-3 (0, 1, 2, 3)',
        ];
    }
}
