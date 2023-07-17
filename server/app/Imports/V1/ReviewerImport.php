<?php

namespace App\Imports\V1;

use App\Http\Requests\V1\StoreReviewerRequest;
use App\Mail\sendPassword;
use App\Models\Reviewer;
use App\Models\AcademicStaff;
use App\Models\UniversitySide;
use App\Models\User;
use App\Services\V1\AcademicStaffService;
use App\Services\V1\ReviewerService;
use App\Services\V1\UniversitySideService;
use App\Services\V1\UserService;
use Illuminate\Support\Facades\Mail;
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

        $row['status'] = 'active';
        $row['password'] = $registeringReviewer['password'];
        $row['roles'] = ['reviewer'];
        $row['staff_position'] = 'academic';
        $row['reviewer_status'] = 'pending';

        return ReviewerService::create($row); //call the function and return the reviewer object
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

        foreach($obj -> registeredReviewers as $registeredReviewer){
            //send email to the registered reviewer
            Mail::to($registeredReviewer['official_email'])->send(new sendPassword($registeredReviewer));
        }

        //now we can access protected properties using the obj
    }
}
