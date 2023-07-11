<?php

namespace App\Imports\V1;

use App\Models\Reviewer;
use App\Models\AcademicStaff;
use App\Models\UniversitySide;
use App\Models\User;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Events\AfterImport;

class ReviewerImport implements ToModel, WithHeadingRow, WithValidation, WithEvents
{
    use RegistersEventListeners, Importable;

    protected $registeredReviewers; //to store the registered reviewers

    public function __construct(){
        $this -> registeredReviewers = [];
    }

    public function headingRow(): int
    {
        return 1;
    }
    public function model(array $row)
    {

        $registeringReviewer = [
            'initials' => $row['initials'],
            'surname' => $row['surname'],
            'official_email' => $row['official_email'],
            'password' => Str::random(10),
        ];

        //push the registering reviewer to the registered reviewers array
        array_push($this->registeredReviewers, $registeringReviewer);

        //reviewer is a specialisation of academic staff who is a specialisation of university side who is a specialisation of user
        //user
        $user = User::create([
            'roles' => json_encode(['reviewer']),
            'initials' => $row['initials'],
            'surname' => $row['surname'],
            'contact_no' => json_encode($row['contact_no']), //for now use only one contact no
            'profile_pic' => $row['profile_pic'], //for now it is just a link to the image, later we have to store the image in the server
            'full_name' => $row['full_name'],
            'official_telephone_no' => $row['official_telephone_no'],
            'nic' => $row['nic'],
            'gender' => $row['gender'],
            'official_email' => $row['official_email'],
            'password' => Hash::make($registeringReviewer['password']),
            'personal_email' => $row['personal_email'],
            'status' => 'active'
        ]);

        //university side
        $universitySide = UniversitySide::create([
            'id' => $user->id,
            'university_id' => $row['university_id'],
            'staff_position' => 'academic'
        ]);

        //academic staff
        $academicStaff = AcademicStaff::create([
            'department' => json_encode([
                'name' => $row['department_name'],
                'head_name' => $row['department_head_name'],
                'head_email' => $row['department_head_email'],
                'postal_address' => $row['department_postal_address']
            ]),

            'designation' => $row['designation'],
            'experience_in_industry' => json_encode($row['experience_in_industry']),
            'google_scholar_link' => $row['google_scholar_link'],
            'nominees' => json_encode($row['nominees']),
            'experience_with_research_funds' => json_encode($row['experience_with_research_funds']),
            'supervised_postgraduate_student_count' => $row['supervised_postgraduate_student_count'],
            'publications_in_referred_journals_count' => $row['publications_in_referred_journals_count'],
            'abstract_count' => $row['abstract_count'],
            'conference_preceedings_count' => $row['conference_preceedings_count'],
            'book_chapters' => $row['book_chapters'],
            'involvement_in_internal_quality_assurance' => json_encode($row['involvement_in_internal_quality_assurance']),
            'involment_in_study_programme_development' => json_encode($row['involment_in_study_programme_development']),
            'postgraduate_teaching_experience' => json_encode($row['postgraduate_teaching_experience']),
            //up to 4 qualifications (need to refactor this)
            'postgraduate_qualifications' => json_encode([
                'qualification_1' => [
                    'qualification' => $row['qualification_1'],
                    'slqf_level' => $row['qualification_1_slqf_level']
                ],
                'qualification_2' => [
                    'qualification' => $row['qualification_2'],
                    'slqf_level' => $row['qualification_2_slqf_level']
                ],
                'qualification_3' => [
                    'qualification' => $row['qualification_3'],
                    'slqf_level' => $row['qualification_3_slqf_level']
                ],
                'qualification_4' => [
                    'qualification' => $row['qualification_4'],
                    'slqf_level' => $row['qualification_4_slqf_level']
                ]
            ]),
            'prior_training_in_programme_review' => json_encode($row['prior_training_in_programme_review']),
            'cv' => $row['cv'], //cv file path (for now it is just a link to the file, later we have to store the file in the server)

            'id' => $universitySide->id
        ]);

        //reviewer
        return new Reviewer([
            'working_faculty' => $row['working_faculty'],
            'id' => $academicStaff->id
        ]);
    }

    //validation for each row
    public function rules() : array{
        //all emails in the system
        $officialEmails = User::select('official_email') -> get() -> pluck('official_email') -> toArray();
        $personalEmails = User::select('personal_email') -> get() -> pluck('personal_email') -> toArray();

        $allEmails = array_merge($officialEmails, $personalEmails);

        return [
            'initials' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'json'],
            'profile_pic' => ['required', 'string', 'max:255'],
            'full_name' => ['required', 'string', 'max:255'],
            'official_telephone_no' => ['required', 'string', 'max:255'],
            'nic' => ['required', 'unique:users,nic'],
            'gender' => ['required', Rule::in('m', 'f')],
            'official_email' => ['required', 'string', 'email',
                //email should be unique in users table (both official_email and personal_email)
                Rule::notIn(...$allEmails)],
            'personal_email' => ['required', 'string', 'email',
                //email should be unique in users table (both official_email and personal_email)
                Rule::notIn(...$allEmails)],

            //university side validation
            'university_id' => ['required'],

            //academic staff validation
            'department_name' => ['required', 'string', 'max:255'],
            'department_head_name' => ['required', 'string', 'max:255'],
            'department_head_email' => ['required', 'string', 'email', 'max:255'],
            'department_postal_address' => ['required', 'string', 'max:255'],
            'designation' => ['required', 'string', 'max:255'],
            'experience_in_industry' => ['required', 'json'], //json array
            'google_scholar_link' => ['required', 'string'],
            'nominees' => ['required', 'json'], //json array
            'experience_with_research_funds' => ['required', 'json'], //json array
            'supervised_postgraduate_student_count' => ['required', 'integer'],
            'publications_in_referred_journals_count' => ['required', 'integer'],
            'abstract_count' => ['required', 'integer'],
            'conference_preceedings_count' => ['required', 'integer'],
            'book_chapters' => ['required', 'integer'],
            'involvement_in_internal_quality_assurance' => ['required', 'json'], //json array
            'involment_in_study_programme_development' => ['required', 'json'], //json array
            'postgraduate_teaching_experience' => ['required', 'json'], //json array
            'qualification_1' => ['required', 'string', 'max:255'],
            'qualification_1_slqf_level' => ['required', 'integer'],
            'qualification_2' => ['required', 'string', 'max:255'],
            'qualification_2_slqf_level' => ['required', 'integer'],
            'qualification_3' => ['required', 'string', 'max:255'],
            'qualification_3_slqf_level' => ['required', 'integer'],
            'qualification_4' => ['required', 'string', 'max:255'],
            'qualification_4_slqf_level' => ['required', 'integer'],
            'prior_training_in_programme_review' => ['required', 'json'], //json array
            'cv' => ['required', 'string'], //cv file path (for now it is just a link to the file, later we have to store the file in the server)

            //reviewer validation
            'working_faculty' => ['required', 'integer'],
        ];
    }

    //validation messages for each row
    public function customValidationMessages(){
        return [
            'initials.required' => 'Initials is required',
            'surname.required' => 'Surname is required',
            'contact_no.required' => 'Contact number is required',
            'profile_pic.required' => 'Profile picture is required',
            'full_name.required' => 'Full name is required',
            'official_telephone_no.required' => 'Official telephone number is required',
            'nic.required' => 'NIC is required',
            'nic.unique' => 'NIC is already used in this system',
            'gender.required' => 'Gender is required',
            'gender.in' => 'Gender should be either m or f',
            'official_email.required' => 'Official email is required',
            'official_email.email' => 'Official email should be a valid email',
            'official_email.not_in' => 'Official email is already used in this system',
            'personal_email.required' => 'Personal email is required',
            'personal_email.email' => 'Personal email should be a valid email',
            'personal_email.not_in' => 'Personal email is already used in this system',
            'university_id.required' => 'University ID is required',
            'department_name.required' => 'Department name is required',
            'department_head_name.required' => 'Department head name is required',
            'department_head_email.required' => "Department head's email address is required",
            'department_head_email.email' => "Department head's email address should be a valid email",
            'department_postal_address.required' => 'Department postal address is required',
            'designation.required' => 'Designation is required',
            'experience_in_industry.required' => 'Experience in industry is required',
            'google_scholar_link.required' => 'Google scholar link is required',
            'nominees.required' => 'Nominees is required',
            'experience_with_research_funds.required' => 'Experience with research funds is required',
            'supervised_postgraduate_student_count.required' => 'Supervised postgraduate student count is required',
            'publications_in_referred_journals_count.required' => 'Publications in referred journals count is required',
            'abstract_count.required' => 'Abstract count is required',
            'conference_preceedings_count.required' => 'Conference preceedings count is required',
            'book_chapters.required' => 'Book chapters count is required',
            'involvement_in_internal_quality_assurance.required' => 'Involvement in internal quality assurance is required',
            'involment_in_study_programme_development.required' => 'Involvement in study programme development is required',
            'postgraduate_teaching_experience.required' => 'Postgraduate teaching experience is required',
            'qualification_1.required' => 'Qualification 1 is required',
            'qualification_1_slqf_level.required' => 'Qualification 1 SLQF level is required',
            'qualification_1_slqf_level.integer' => 'Qualification 1 SLQF level should be an integer',
            'qualification_2.required' => 'Qualification 2 is required',
            'qualification_2_slqf_level.required' => 'Qualification 2 SLQF level is required',
            'qualification_2_slqf_level.integer' => 'Qualification 2 SLQF level should be an integer',
            'qualification_3.required' => 'Qualification 3 is required',
            'qualification_3_slqf_level.required' => 'Qualification 3 SLQF level is required',
            'qualification_3_slqf_level.integer' => 'Qualification 3 SLQF level should be an integer',
            'qualification_4.required' => 'Qualification 4 is required',
            'qualification_4_slqf_level.required' => 'Qualification 4 SLQF level is required',
            'qualification_4_slqf_level.integer' => 'Qualification 4 SLQF level should be an integer',
            'prior_training_in_programme_review.required' => 'Prior training in programme review is required',
            'cv.required' => 'CV is required',
            'cv.file' => 'CV should be a file', //cv file path (for now it is just a link to the file, later we have to store the file in the server)
        ];
    }



    //prepare data before validation
    public function prepareForValidation($data, $index){
        //json array fields
        $fields = [
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
        foreach($fields as $field){
            if(isset($data[$field]) and $data[$field] != null and is_string($data[$field])){
                $data[$field] = explode(',' , $data[$field]);
            }
        }

        //convert json arrays to json strings
        foreach($fields as $field){
            if(isset($data[$field]) and $data[$field] != null){
                $data[$field] = json_encode($data[$field]);
            }
        }

        //convert official_telephone_no to string
        if(isset($data['official_telephone_no']) and $data['official_telephone_no'] != null){
            $data['official_telephone_no'] = (string)$data['official_telephone_no'];
        }

        return $data;
    }

    //what is needed to be done after importing
    public static function afterImport(AfterImport $event){

        //print protected array
        $obj = $event->getConcernable();

        //now we can access protected properties using the obj 
    }
}
