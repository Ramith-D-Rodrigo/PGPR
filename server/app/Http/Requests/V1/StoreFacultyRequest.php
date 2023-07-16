<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreFacultyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //set true for now, we will add authorization later
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'dean_id' => ['integer'],   //must add : exists:deans,id , 'required' is not added because we will add the dean later
            'website' => ['required', 'string', 'max:255', 'unique:faculties'],
            'address'=> ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'json'],
            'fax_no' => ['required', 'json'],
            'university_id' => ['required', 'integer', 'exists:universities,id'],
            //'iqau_id', //not in the migration
            // need to add qac or cqa director id (who added the faculty)
        ];
    }

    public function prepareForValidation(){
        //convert all fields to snake case
        $fieldsWithVals = $this -> all();
        $newFieldsWithVals = [];
        foreach($fieldsWithVals as $key => $val){
            $newFieldsWithVals[Str::snake($key)] = $val;
        }

        $this -> replace($newFieldsWithVals); //replace the fields with snake case fields (the new fields)


        //convert contactNo and faxNo to json
        if($this -> has('contact_no') and $this -> contact_no !== 'null'){ //if contact_no is given and not null
            $this -> merge([
                'contact_no' => json_encode($this -> contact_no)
            ]);
        }

        if($this -> has('fax_no') and $this -> fax_no !== 'null'){ //if fax_no is given and not null
            $this -> merge([
                'fax_no' => json_encode($this -> fax_no)
            ]);
        }
    }
}
