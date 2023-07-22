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
            "contact_no" => ["required", "json"],
            "fax_no" => ["required", "json"],
        ];
    }

    protected function prepareForValidation(){
        //convert contactNo and faxNo to json
        if($this -> has('contactNo') and $this -> contactNo !== 'null'){ //if contactNo is given and not null
            $this -> merge([
                'contact_no' => json_encode($this -> contactNo)
            ]);
        }

        if($this -> has('faxNo') and $this -> faxNo !== 'null'){ //if faxNo is given and not null
            $this -> merge([
                'fax_no' => json_encode($this -> faxNo)
            ]);
        }
    }
}
