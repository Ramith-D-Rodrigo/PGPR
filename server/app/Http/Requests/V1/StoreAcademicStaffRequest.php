<?php

namespace App\Http\Requests\V1;

use App\Models\UniversitySide;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreAcademicStaffRequest extends StoreUniversitySideRequest
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
        $rulesArr = parent::rules(); //get the rules from the parent class (StoreUniversitySideRequest)

        //add the rules for academic staff
        $rulesArr['department_name'] = ['required', 'string', 'max:255'];
        $rulesArr['department_head_name'] = ['required', 'string', 'max:255'];
        $rulesArr['department_head_email'] = ['required', 'string', 'email', 'max:255'];
        $rulesArr['department_postal_address'] = ['required', 'string', 'max:255'];
        $rulesArr['designation'] = ['required', 'string', 'max:255'];
        $rulesArr['experience_in_industry'] = ['required', 'json']; //json array
        $rulesArr['google_scholar_link'] = ['required', 'string'];
        $rulesArr['nominees'] = ['required', 'json']; //json array
        $rulesArr['experience_with_research_funds'] = ['required', 'json']; //json array
        $rulesArr['supervised_postgraduate_student_count'] = ['required', 'integer'];
        $rulesArr['publications_in_referred_journals_count'] = ['required', 'integer'];
        $rulesArr['abstract_count'] = ['required', 'integer'];
        $rulesArr['conference_preceedings_count'] = ['required', 'integer'];
        $rulesArr['book_chapters'] = ['required', 'integer'];
        $rulesArr['involvement_in_internal_quality_assurance'] = ['required', 'json']; //json array
        $rulesArr['involment_in_study_programme_development'] = ['required', 'json']; //json array
        $rulesArr['postgraduate_teaching_experience'] = ['required', 'json']; //json array
        $rulesArr['qualification_1'] = ['required', 'string', 'max:255'];
        $rulesArr['qualification_1_slqf_level'] = ['required', 'integer'];
        $rulesArr['qualification_2'] = ['required', 'string', 'max:255'];
        $rulesArr['qualification_2_slqf_level'] = ['required', 'integer'];
        $rulesArr['qualification_3'] = ['required', 'string', 'max:255'];
        $rulesArr['qualification_3_slqf_level'] = ['required', 'integer'];
        $rulesArr['qualification_4'] = ['required', 'string', 'max:255'];
        $rulesArr['qualification_4_slqf_level'] = ['required', 'integer'];
        $rulesArr['prior_training_in_programme_review'] = ['required', 'json']; //json array
        $rulesArr['cv'] = ['required', 'string']; //cv file path (for now it is just a link to the file, later we have to store the file in the server)

        return $rulesArr;
    }

    public function prepareForValidation(){
        //convert camel case to snake case
        $fieldsWithVals = $this -> all();
        $newFieldsWithVals = [];
        foreach($fieldsWithVals as $key => $val){
            $newFieldsWithVals[Str::snake($key)] = $val;
        }

        $this -> replace($newFieldsWithVals); //replace the fields with snake case fields (the new fields)


        $jsonProperties = [
            'contact_no',
            'experience_in_industry',
            'nominees',
            'experience_with_research_funds',
            'involvement_in_internal_quality_assurance',
            'involment_in_study_programme_development',
            'postgraduate_teaching_experience',
            'prior_training_in_programme_review'
        ];

        //convert strings to json arrays splitted by comma
        foreach($jsonProperties as $field){
            if(isset($this -> $field) and $this -> $field != null and is_string($this -> $field)){
                $this -> $field = explode(',' , $this -> $field);
            }
        }

        //convert json arrays to json strings
        foreach($jsonProperties as $field){
            if(isset($this -> $field) and $this -> $field != null){
                $this -> $field = json_encode($this -> $field);
            }
        }

        //convert official_telephone_no to string
        if(isset($this -> official_telephone_no) and $this -> official_telephone_no != null){
            $this -> merge(['official_telephone_no' => (string)$this -> official_telephone_no]);
        }
    }
}
