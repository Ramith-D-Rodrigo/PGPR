<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRejectPGPRInDERequest extends FormRequest
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
     * POST-request data +>
     *     {
     *         pgpr: 10,
     *         comment: "This is not a good post graduate program"
     *     }
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => ['required'],
            'comment' => 'required|min:10|max:255'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(
            [
                'pgpr_id' => $this->pgpr
            ]
        );
    }

    public function messages(): array
    {
        return [
            'pgpr_id.required' => 'The post graduate review id is required.',
            'pgpr_id.exists' => 'The post graduate program that you have mentioned cannot be found among our records or it is not in a state that can be rejected.',
            'comment.required' => 'You need to provide reasons for rejecting the post graduate program review.',
            'comment.min' => 'THe minimum length of the comment can be 10 characters.',
            'comment.max' => 'THe maximum length of the comment can be 255 characters.',
        ];
    }
}
