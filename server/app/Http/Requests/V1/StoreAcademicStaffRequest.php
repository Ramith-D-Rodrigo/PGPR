<?php

namespace App\Http\Requests\V1;

use App\Models\UniversitySide;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
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
        $rulesArr['nominees'] = ['json']; //json array
        $rulesArr['experience_with_research_funds'] = ['json']; //json array
        $rulesArr['supervised_postgraduate_student_count'] = ['integer'];
        $rulesArr['publications_in_referred_journals_count'] = ['integer'];
        $rulesArr['abstract_count'] = ['integer'];
        $rulesArr['conference_preceedings_count'] = ['integer'];
        $rulesArr['book_chapters'] = ['integer'];
        $rulesArr['involvement_in_internal_quality_assurance'] = ['json']; //json array
        $rulesArr['involment_in_study_programme_development'] = ['json']; //json array
        $rulesArr['postgraduate_teaching_experience'] = ['json']; //json array
        $rulesArr['qualification_1'] = ['required', 'string', 'max:255'];
        $rulesArr['qualification_1_slqf_level'] = ['required', 'integer'];
        $rulesArr['qualification_2'] = ['required', 'string', 'max:255'];
        $rulesArr['qualification_2_slqf_level'] = ['required', 'integer'];
        $rulesArr['qualification_3'] = ['string', 'max:255', 'present', 'nullable'];
        $rulesArr['qualification_3_slqf_level'] = ['integer', 'present', 'nullable'];
        $rulesArr['qualification_4'] = ['string', 'max:255', 'present', 'nullable'];
        $rulesArr['qualification_4_slqf_level'] = ['integer', 'present', 'nullable'];
        $rulesArr['prior_training_in_programme_review'] = ['json']; //json array
        $rulesArr['cv'] = ['file', 'mimes:pdf', 'max:2048', 'present', 'nullable']; //2MB max

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
                $this -> merge([$field => json_encode($this -> $field)]);
            }
        }

        //convert official_telephone_no to string
        if(isset($this -> official_telephone_no) and $this -> official_telephone_no != null){
            $this -> merge(['official_telephone_no' => (string)$this -> official_telephone_no]);
        }
    }

    //custom validation messages
    public function messages() : array{
        $parentMsgs = parent::messages(); //get the messages from the parent class (StoreUniversitySideRequest)

        $messageArr = [
            'university_id.required' => 'University ID is required',
            'department_name.required' => 'Department name is required',
            'department_head_name.required' => 'Department head name is required',
            'department_head_email.required' => "Department head's email address is required",
            'department_head_email.email' => "Department head's email address should be a valid email",
            'department_postal_address.required' => 'Department postal address is required',
            'designation.required' => 'Designation is required',
            'experience_in_industry.required' => 'Experience in industry is required',
            'google_scholar_link.required' => 'Google scholar link is required',
            'qualification_1.required' => 'Qualification 1 is required',
            'qualification_1_slqf_level.required' => 'Qualification 1 SLQF level is required',
            'qualification_1_slqf_level.integer' => 'Qualification 1 SLQF level should be an integer',
            'qualification_2.required' => 'Qualification 2 is required',
            'qualification_2_slqf_level.required' => 'Qualification 2 SLQF level is required',
            'qualification_2_slqf_level.integer' => 'Qualification 2 SLQF level should be an integer',
            'qualification_3_slqf_level.integer' => 'Qualification 3 SLQF level should be an integer',
            'qualification_4_slqf_level.integer' => 'Qualification 4 SLQF level should be an integer',
            'prior_training_in_programme_review.required' => 'Prior training in programme review is required',
            'cv.file' => 'CV should be a file',
            'cv.mimes' => 'CV should be a PDF file',
            'cv.max' => 'CV should be less than 2MB'
        ];

        return array_merge($parentMsgs, $messageArr);
    }
}
