<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoreUniversityRequest extends FormRequest
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
            //
            "name" => ["required", "string", "max:255", "unique:universities"],
            "address" => ["required", "string", "max:255", "unique:universities"],
            "website" => ["required", "string", "max:255", "unique:universities"],
            "contact_no" => ["required", "json"],
            "fax_no" => ["required", "json"],

            //center for quality assurance details are also needed
            'cqa_contact_no' => ['required', 'json'],
            'cqa_fax_no' => ['required', 'json'],
            'cqa_email' => ['required', 'unique:center_for_quality_assurances,email']
        ];
    }

    protected function prepareForValidation(){
        //convert contactNo and faxNo to json
        if($this -> has('contactNo') and $this -> contactNo !== 'null'){ //if contactNo is given and not null
            $this -> merge([
                'contactNo' => json_encode($this -> contactNo)
            ]);
        }

        if($this -> has('faxNo') and $this -> faxNo !== 'null'){ //if faxNo is given and not null
            $this -> merge([
                'faxNo' => json_encode($this -> faxNo)
            ]);
        }

        //convert cqa_contact_no and cqa_fax_no to json
        if($this -> has('cqaContactNo') and $this -> cqaContactNo !== 'null'){ //if cqa_contact_no is given and not null
            $this -> merge([
                'cqaContactNo' => json_encode($this -> cqaContactNo)
            ]);
        }

        if($this -> has('cqaFaxNo') and $this -> cqaFaxNo !== 'null'){ //if cqa_fax_no is given and not null
            $this -> merge([
                'cqaFaxNo' => json_encode($this -> cqaFaxNo)
            ]);
        }

        //convert camel case to snake case
        $all = $this -> all();

        $newFieldsWithVals = [];
        foreach($all as $key => $val){
            $newFieldsWithVals[Str::snake($key)] = $val;
        }

        $this -> replace($newFieldsWithVals); //replace the fields with snake case fields (the new fields)
    }
}
