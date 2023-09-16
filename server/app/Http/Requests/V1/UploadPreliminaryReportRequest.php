<?php

namespace App\Http\Requests\V1;

use App\Models\PostGraduateProgramReview;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadPreliminaryReportRequest extends FormRequest
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
     * POST request +>
     *                 {
     *                     pgpr: 10,
     *                     file: abc.pdf, // could be other types as well
     *                 }
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'pgpr_id' => [
                'required',
                'exists:post_graduate_program_reviews,id',
                function ($attribute, $value, $fail) {
                    $pgpr = PostGraduateProgramReview::find($value);
                    if ($pgpr->status_of_pgpr != 'PE2') {
                        $fail('The post graduate review program is not in an updatable state.');
                    }
                },
            ],
            'file' => [
                'required',
                'file',
                'mimes:pdf,docx,doc',
                'max:40960'//the maximum file size is 4MB
            ]
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
            'pgpr_id.required' => 'The post graduate program review id is required.',
            'pgpr_id.exists' => 'The post graduate program review does not exist in our database.',
            'file.required' => 'You have not provided any preliminary report to be uploaded.',
            'file.mimes' => 'You can only submit a pdf, MS doc or MS docx document as the preliminary report.',
            'file.file' => 'You should submit a file, this is not a field to upload text or any other type of data but a file.',
            'file.max' => 'You can only submit a pdf documents with a maximum size of 40MB.',
        ];
    }
}