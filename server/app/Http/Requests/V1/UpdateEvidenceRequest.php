<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateEvidenceRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {

        return [
            'evidence_code' => ['sometimes', 'required', 'string', 'max:100'],
            'evidence_name' => ['sometimes', 'required', 'string', 'max:100'],
            //applicable years should be from 1 to 5
            'applicable_years' => ['sometimes', 'required', 'array', 'min:1', 'max:5'], //array of integers
            'applicable_years.*' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            //the url should be a google drive url
            'url' => ['sometimes', 'required', 'url'],
        ];
    }

    public function prepareForValidation() {

        //convert camel case to snake case
        $reqValues = $this->all();
        $newArr = [];
        foreach ($reqValues as $key => $value) {
            $newArr[Str::snake($key)] = $value;
        }
        $this -> replace($newArr);

    }
}
