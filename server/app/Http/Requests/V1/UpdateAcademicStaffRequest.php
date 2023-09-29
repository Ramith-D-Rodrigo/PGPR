<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateAcademicStaffRequest extends FormRequest
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
        //add the rules for academic staff
        $rulesArr['department_name'] = ['sometimes', 'required', 'string', 'max:255'];
        $rulesArr['department_head_name'] = ['sometimes', 'required', 'string', 'max:255'];
        $rulesArr['department_head_email'] = ['sometimes', 'required', 'string', 'email', 'max:255'];
        $rulesArr['department_postal_address'] = ['sometimes', 'required', 'string', 'max:255'];
        $rulesArr['designation'] = ['sometimes', 'required', 'string', 'max:255'];
        $rulesArr['experience_in_industry'] = ['sometimes', 'required', 'json']; //json array
        $rulesArr['google_scholar_link'] = ['sometimes', 'required', 'string'];
        $rulesArr['nominees'] = ['sometimes', 'json']; //json array
        $rulesArr['experience_with_research_funds'] = ['sometimes', 'json']; //json array
        $rulesArr['supervised_postgraduate_student_count'] = ['sometimes', 'integer'];
        $rulesArr['publications_in_referred_journals_count'] = ['sometimes', 'integer'];
        $rulesArr['abstract_count'] = ['sometimes', 'integer'];
        $rulesArr['conference_preceedings_count'] = ['sometimes', 'integer'];
        $rulesArr['book_chapters'] = ['sometimes', 'integer'];
        $rulesArr['involvement_in_internal_quality_assurance'] = ['sometimes', 'json']; //json array
        $rulesArr['involvement_in_study_programme_development'] = ['sometimes', 'json']; //json array
        $rulesArr['postgraduate_teaching_experience'] = ['sometimes', 'json']; //json array
        $rulesArr['qualification_1'] = ['sometimes', 'required', 'string', 'max:255'];
        $rulesArr['qualification_1_slqf_level'] = ['sometimes', 'required', 'integer'];
        $rulesArr['qualification_2'] = ['sometimes', 'required', 'string', 'max:255'];
        $rulesArr['qualification_2_slqf_level'] = ['sometimes', 'required', 'integer'];
        $rulesArr['qualification_3'] = ['sometimes', 'string', 'max:255', 'present', 'nullable'];
        $rulesArr['qualification_3_slqf_level'] = ['sometimes', 'integer', 'present', 'nullable'];
        $rulesArr['qualification_4'] = ['sometimes', 'string', 'max:255', 'present', 'nullable'];
        $rulesArr['qualification_4_slqf_level'] = ['sometimes', 'integer', 'present', 'nullable'];
        $rulesArr['prior_training_in_programme_review'] = ['sometimes', 'json']; //json array
        $rulesArr['cv'] = ['sometimes', 'file', 'mimes:pdf', 'max:2048', 'present', 'nullable']; //2MB max

        return $rulesArr;
    }

    public function prepareForValidation() {
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
            'involvement_in_study_programme_development',
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
                $this -> merge([$field => json_encode($this -> $field)]);
            }
        }

        //convert official_telephone_no to string
        if(isset($this -> official_telephone_no) and $this -> official_telephone_no != null){
            $this -> merge(['official_telephone_no' => (string)$this -> official_telephone_no]);
        }
    }
}
