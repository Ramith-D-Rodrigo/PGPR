<?php

namespace App\Imports\V1;

use App\Http\Requests\V1\StoreReviewerRequest;
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
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Events\AfterImport;

class ReviewerImport implements ToModel, WithHeadingRow, WithValidation, WithEvents
{
    use RegistersEventListeners, Importable;

    protected $registeredReviewers; //to store the registered reviewers
    protected $reviewerRequestObj; //to store the reviewer request object

    public function __construct(){
        $this -> registeredReviewers = [];
        $this -> reviewerRequestObj = new StoreReviewerRequest();
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
            'contact_no' => $row['contact_no'], //for now use only one contact no
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
            'experience_in_industry' => $row['experience_in_industry'],
            'google_scholar_link' => $row['google_scholar_link'],
            'nominees' => $row['nominees'],
            'experience_with_research_funds' => $row['experience_with_research_funds'],
            'supervised_postgraduate_student_count' => $row['supervised_postgraduate_student_count'],
            'publications_in_referred_journals_count' => $row['publications_in_referred_journals_count'],
            'abstract_count' => $row['abstract_count'],
            'conference_preceedings_count' => $row['conference_preceedings_count'],
            'book_chapters' => $row['book_chapters'],
            'involvement_in_internal_quality_assurance' => $row['involvement_in_internal_quality_assurance'],
            'involment_in_study_programme_development' => $row['involment_in_study_programme_development'],
            'postgraduate_teaching_experience' => $row['postgraduate_teaching_experience'],
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
            'prior_training_in_programme_review' => $row['prior_training_in_programme_review'],
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
        //reviewer request obj
        return $this -> reviewerRequestObj -> rules();

    }

    //validation messages for each row
    public function customValidationMessages(){
        return $this -> reviewerRequestObj -> messages();
    }



    //prepare data before validation
    public function prepareForValidation($data, $index){
        //json array fields

        $this -> reviewerRequestObj -> replace($data);

        //add staff position to the request object
        $this -> reviewerRequestObj -> merge(['staff_position' => 'academic']);

        $this -> reviewerRequestObj -> prepareForValidation();

        return $this -> reviewerRequestObj -> all();
    }

    //what is needed to be done after importing
    public static function afterImport(AfterImport $event){

        //print protected array
        $obj = $event->getConcernable();

        //now we can access protected properties using the obj
    }
}
