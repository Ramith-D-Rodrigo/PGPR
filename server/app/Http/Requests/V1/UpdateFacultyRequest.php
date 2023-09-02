<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateFacultyRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'website' => ['sometimes', 'required', 'string', 'max:255', 'unique:faculties'],
            'address'=> ['sometimes', 'required', 'string', 'max:255'],
            'contact_no' => ['sometimes','required', 'json'],
            'fax_no' => ['sometimes','required', 'json'],

            //iqau data is also required
            'iqau_address' => ['sometimes', 'required', 'string', 'max:255'],
            'iqau_contact_no' => ['sometimes','required', 'json'],
            'iqau_fax_no' => ['sometimes', 'required', 'json'],
            'iqau_email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:internal_quality_assurance_units,email'],
        ];
    }

    public function prepareForValidation(){
        //convert camel case to snake case
        $returnArr = [];

        $objProps = $this -> all();

        foreach($objProps as $key => $value){
            $returnArr[Str::snake($key)] = $value;
        }

        $this -> replace($returnArr);
    }
}
