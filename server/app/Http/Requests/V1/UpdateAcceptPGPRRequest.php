<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAcceptPGPRRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //check whether the reviewer is in the review team
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
            //
            'pgpr_id' => 'required|exists:post_graduate_program_reviews,id',
            'file' => 'required|file|mimes:pdf|max:4096'//the maximum file size is 4MB
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'pgpr_id' => $this->pgprID,
        ]);
    }

    public function messages()
    {
        return [
            'pgpr_id.required' => "Need to send the ID of the post graduate program in order to process the request.",
            'pgpr_id.exists' => "There is no such a post graduate program in our database.",
            'file.required' => "You need to send a signed copy of the declaration form with the request.",
            'file.mime' => "The file should be of type pdf.",
            'file.max' => "You have exceeded the maximum file size, which is 4MB."
        ];
    }
}
