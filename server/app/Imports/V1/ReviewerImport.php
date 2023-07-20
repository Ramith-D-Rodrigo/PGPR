<?php

namespace App\Imports\V1;

use App\Http\Requests\V1\StoreReviewerRequest;
use App\Mail\sendPassword;
use App\Models\Reviewer;
use App\Models\AcademicStaff;
use App\Models\UniversitySide;
use App\Models\User;
use App\Services\V1\AcademicStaffService;
use App\Services\V1\DriveManager;
use App\Services\V1\ReviewerService;
use App\Services\V1\UniversitySideService;
use App\Services\V1\UserService;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
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
    protected $driveManager; //to store the drive manager object

    public function __construct(){
        $this -> driveManager = new DriveManager();
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

        //download the profile pic and cv
        //getFile returns an array [file contents, file extension]
        $profilePic = $this -> driveManager -> getFile($row['profile_pic']);
        $cv = $this -> driveManager -> getFile($row['cv']);

        //store the profile pic and cv in the system (use Storage facade)

        //first create the folders if they don't exist
        if(!File::exists(public_path('storage/profile_pics'))){
            File::makeDirectory(public_path('storage/profile_pics'));
        }
        if(!File::exists(public_path('storage/cvs'))){
            File::makeDirectory(public_path('storage/cvs'));
        }

        $cvNameAndExtension = $row['official_email'] . '.' . $cv["fileExtension"];
        $profilePicNameAndExtension = $row['official_email'] . '.' . $profilePic["fileExtension"];

        //store the files
        Storage::put('public/profile_pics/' . $profilePicNameAndExtension, $profilePic["fileContent"]);
        Storage::put('public/cvs/' . $cvNameAndExtension, $cv["fileContent"]);

        //get the profile pic and cv urls
        $profilePicUrl = Storage::url('public/profile_pics/' . $profilePicNameAndExtension);
        $cvUrl = Storage::url('public/cvs/' . $cvNameAndExtension);

        //replace the profile pic and cv with the urls
        $row['profile_pic'] = $profilePicUrl;
        $row['cv'] = $cvUrl;

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
        $arr = $this -> reviewerRequestObj -> rules();

        //change profile pic and cv rules (because cv and profile pics are google drive links)
        $arr['profile_pic'] = ['url', 'present'];
        $arr['cv'] = ['url', 'present'];

        return $arr;
    }

    //validation messages for each row
    public function customValidationMessages(){
        $msgs = $this -> reviewerRequestObj -> messages();

        //change profile pic and cv rules (because cv and profile pics are google drive links)
        $msgs['profile_pic.url'] = 'The profile pic must be a valid url';
        $msgs['cv.url'] = 'The cv must be a valid url';
        $msgs['profile_pic.present'] = 'The profile pic is required';
        $msgs['cv.present'] = 'The cv is required';

        return $msgs;
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
            Mail::to($registeredReviewer['official_email'])->send(new sendPassword($registeredReviewer, "Appointment of Reviewer for Postgraduate Programme Review", "mail.reviewerPassword"));
        }

        //now we can access protected properties using the obj
    }
}
