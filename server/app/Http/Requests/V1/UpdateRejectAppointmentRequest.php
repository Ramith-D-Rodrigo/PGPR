<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRejectAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //should be done in the early stages, before becoming an actual reviewer
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
            // this is optional
            'remark' => 'nullable|max:255',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'remark' => $this->reasonForRejecting,
        ]);
    }
}
