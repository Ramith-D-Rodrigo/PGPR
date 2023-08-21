<?php

namespace App\Http\Requests\V1;

use App\Models\Faculty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoreFacultyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //only cqa director can add a faculty
        $uniSide = Auth::user() -> universitySide ?? null;

        if($uniSide === null){
            return false;
        }

        $qaStaff = $uniSide -> qualityAssuranceStaff ?? null;
        if($qaStaff === null){
            return false;
        }

        $cqaDirector = $qaStaff -> centerForQualityAssuranceDirector ?? null;

        //only can create for his university

        $universityId = $this -> university_id;

        if($universityId !== $uniSide -> university_id){
            return false;
        }

        return $cqaDirector !== null;
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

            //iqau data is also required
            'iqau_address' => ['required', 'string', 'max:255'],
            'iqau_contact_no' => ['required', 'json'],
            'iqau_fax_no' => ['required', 'json'],
            'iqau_email' => ['required', 'string', 'email', 'max:255', 'unique:internal_quality_assurance_units,email'],

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
        //convert iqau_contact_no and iqau_fax_no to json
        if($this -> has('iqau_contact_no') and $this -> iqau_contact_no !== 'null'){ //if iqau_contact_no is given and not null
            $this -> merge([
                'iqau_contact_no' => json_encode($this -> iqau_contact_no)
            ]);
        }

        if($this -> has('iqau_fax_no') and $this -> iqau_fax_no !== 'null'){ //if iqau_fax_no is given and not null
            $this -> merge([
                'iqau_fax_no' => json_encode($this -> iqau_fax_no)
            ]);
        }

        //add current logged in cqa_director's university to university_id
        $this -> merge([
            'university_id' => Auth::user() -> universitySide -> university_id ?? null
        ]);
    }
}
