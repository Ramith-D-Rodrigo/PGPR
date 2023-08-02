<?php

namespace App\Http\Requests\V1;

use App\Models\PostGraduateProgram;
use App\Models\PostGraduateProgramReviewApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdatePostGraduateProgramReviewApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = Auth::user();
        if(!$user){
            return false;
        }

        //a user is logged in

        //only dean can create a post graduate program review application
        $dean = $user -> universitySide -> academicStaff -> dean ?? null;

        if(!$dean){
            return false;
        }

        //a dean is logged in
        //check if the dean is adding the post graduate program review application for his faculty
        $deanFacultyID = $dean -> faculty -> id;

        //compare the dean's faculty id with the faculty id of the post graduate program

        //get the post graduate program review application
        $pgprApplication = $this -> route('pgprApplication');

        //find the postgraduate program
        $postGraduateProgram = PostGraduateProgram::find($pgprApplication -> post_graduate_program_id);

        //get the faculty id of the post graduate program
        $postGraduateProgramFacultyID = $postGraduateProgram -> faculty -> id;

        if($deanFacultyID !== $postGraduateProgramFacultyID){
            return false;
        }

        //the dean is adding the post graduate program review application for his faculty
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $deanFacultyID = null;
        if(Auth::user()){
            $dean = Auth::user();
            //get dean's faculty id from relationships as dean is user model
            $deanFacultyID = $dean -> universitySide -> academicStaff -> dean -> faculty -> id;
        }

        $returnArr = [
            //TODO: years should be greater than the previous year input considering both current and previous values(in the database)
            'year_1' => ['sometimes', 'required', 'string'],
            //year_2 should be greater than year_1
            'year_2' => ['sometimes', 'required', 'string'],
            //year_3 should be greater than year_2
            'year_3' => ['sometimes', 'required', 'string'],
            //year_4 should be greater than year_3
            'year_4' => ['sometimes', 'required', 'string'],
            //year_5 should be greater than year_4
            'year_5' => ['sometimes', 'required', 'string'],
            'y_end' => ['sometimes', 'required', 'date'],
            'dean_id' => ['sometimes', 'required', 'integer', 'exists:deans,id'],
            'intent_letter' => ['sometimes', 'required', 'file', 'mimes:pdf'],
        ];

        $returnArr['post_graduate_program_id'] =
            ['required', 'integer', Rule::exists('post_graduate_programs', 'id') -> where(function($query) use ($deanFacultyID){
                $query -> where('faculty_id', $deanFacultyID);
            }), 'sometimes'];

        return $returnArr;
    }

    public function prepareForValidation(){
        //convert camel case keys to snake case
        $objProps = $this -> all();

        $returnArr = [];

        foreach($objProps as $key => $value){
            $returnArr[Str::snake($key)] = $value;
        }

        $this -> replace($returnArr);
    }

    public function messages(){
        return [
            'year_1.required' => 'Year 1 is required',
            'year_2.required' => 'Year 2 is required',
            'year_3.required' => 'Year 3 is required',
            'year_4.required' => 'Year 4 is required',
            'year_5.required' => 'Year 5 is required',
            'y_end.required' => 'Evidences referencing date is required',
            'y_end.after' => 'Evidences referencing date should be after year 5',
            'y_end.date' => 'Evidences referencing date should be a date',
            'post_graduate_program_id.required' => 'Post graduate program id is required',
            'post_graduate_program_id.exists' => 'Post graduate program id does not exist',
            'post_graduate_program_id.integer' => 'Post graduate program id must be an integer',
            'intent_letter.required' => 'Intent letter is required',
            'intent_letter.file' => 'Intent letter should be a file',
            'intent_letter.mimes' => 'Intent letter should be a pdf file',
        ];
    }
}
