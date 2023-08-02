<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRejectPGPRAssignmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'comment' => 'required|min:1|max:255'//the maximum file size is 4MB
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'pgpr_id' => $this->pgprID
        ]);
    }

    public function messages()
    {
        return [
            'pgpr_id.required' => "Need to send the ID of the post graduate program in order to process the request.",
            'pgpr_id.exists' => "There is no such a post graduate program in our database.",
            'comment.required' => "You need to provide a reason for rejecting this assignment.",
            'comment.min' => "The reason you provide must at least contain a single word.",
            'comment.max' => "The reason that you provide can only contain at most 255 characters."
        ];
    }
}
