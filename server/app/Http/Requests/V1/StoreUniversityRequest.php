<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreUniversityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //anyone can create a university (for now, we will add authorization later)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            //
            "name" => ["required", "string", "max:255", "unique:universities"],
            "address" => ["required", "string", "max:255", "unique:universities"],
            "website" => ["required", "string", "max:255", "unique:universities"],
            "contact_no" => ["required", "json"], //snake_case is because of the database column name (camelCase is because of the json request field name)
            "fax_no" => ["required", "json"],
        ];
    }

    protected function prepareForValidation(){
        $this->merge([
            'contact_no' => json_encode($this -> contactNo),
            'fax_no' => json_encode($this -> faxNo),
        ]);
    }
}
