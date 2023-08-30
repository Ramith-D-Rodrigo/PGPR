<?php

namespace App\Http\Requests\V1;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateUniversityRequest extends FormRequest
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
            "name" => ['sometimes', "required", "string", "max:255", "unique:universities"],
            "address" => ['sometimes', "required", "string", "max:255", "unique:universities"],
            "website" => ['sometimes', "required", "string", "max:255", "unique:universities"],
            "contact_no" => ['sometimes', "required", "json"],
            "fax_no" => ['sometimes', "required", "json"],

            //center for quality assurance details are also needed
            'cqa_contact_no' => ['sometimes', 'required', 'json'],
            'cqa_fax_no' => ['sometimes', 'required', 'json'],
            'cqa_email' => ['sometimes', 'required', 'unique:center_for_quality_assurances,email']
        ];
    }

    public function prepareForValidation() {
        //convert camel case to snake case
        $objProps = $this -> all();
        $returnArr = [];

        foreach($objProps as $key => $val){
            $returnArr[Str::snake($key)] = $val;
        }

        $this -> replace($returnArr);
    }
}
