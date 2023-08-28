<?php

use App\Http\Controllers\Api\V1\UserController;
use App\Http\Middleware\AuthorizeAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return Auth::user();
});

Route::middleware(['auth:sanctum'])->get('/auth', [UserController::class, 'loginAuth']);

Route::middleware(['auth:sanctum', 'authorize.role:reviewer'])->get('/role/user', function (Request $request) {
    return Auth::user()->roles;
});

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1'], function () {
    //all routes that belong to v1 version of the API will go here
    //for now, the routes for all the controllers are defined
    //later we can remove the routes that are not needed

    //route for reviewer import from excel
    Route::post('reviewers/import', 'ReviewerController@importReviewers');
    Route::get('reviewers/downloadExcelFile', 'ReviewerController@downloadExcelFile');

    //TODO: Renamed route names should reflect on the method names in the controllers
    Route::apiResource('postGraduatePrograms', 'PostGraduateProgramController') -> middleware('auth');
    //other routes of the postGraduatePrograms
        //get post graduate program reviews of a post graduate program
        Route::get('postGraduatePrograms/{postGraduateProgram}/reviews', 'PostGraduateProgramController@reviews') -> middleware('auth');
        //get the faculty of a post graduate program
        Route::get('postGraduatePrograms/{postGraduateProgram}/faculty', 'PostGraduateProgramController@faculty') -> middleware('auth');
        //get the current program coordinator of a post graduate program
        Route::get('postGraduatePrograms/{postGraduateProgram}/currentCoordinator', 'PostGraduateProgramController@currentCoordinator') -> middleware('auth');

    Route::apiResource('viceChancellors', 'ViceChancellorController');
    //other routes of vice chancellor
        //remove role of vice chancellor
        Route::post('viceChancellors/{viceChancellor}/removeRole', 'ViceChancellorController@removeRole') -> middleware('auth');

    Route::apiResource('users', 'UserController');
    Route::apiResource('universitySides', 'UniversitySideController');
    Route::apiResource('universities', 'UniversityController')->middleware('auth');
    //other routes of the universities
        //get the current vice chancellor of a university
        Route::get('universities/{university}/currentViceChancellor', 'UniversityController@currentViceChancellor') -> middleware('auth');
        //get faculties of a university
        Route::get('universities/{university}/faculties', 'UniversityController@faculties') -> middleware('auth');

    Route::apiResource('standards', 'StandardController');
    Route::apiResource('selfEvaluationReports', 'SelfEvaluationReportController') -> middleware('auth');
    Route::apiResource('reviewTeams', 'ReviewTeamController');
    Route::apiResource('qualityAssuranceStaffs', 'QualityAssuranceStaffController');
    Route::apiResource('qacOfficers', 'QualityAssuranceCouncilOfficerController');
    Route::apiResource('qacDirectors', 'QualityAssuranceCouncilDirectorController');
    Route::apiResource('properEvaluations', 'ProperEvaluationController');
    Route::apiResource('programmeCoordinators', 'ProgrammeCoordinatorController')-> middleware('auth');
    //other routes of the programmeCoordinators
        //get the post graduate program of the programme coordinator
        Route::get('programmeCoordinators/{programmeCoordinator}/postGraduateProgram', 'ProgrammeCoordinatorController@postGraduateProgram') -> middleware('auth');
        //remove role of programme coordinator
        Route::post('programmeCoordinators/{programmeCoordinator}/removeRole', 'ProgrammeCoordinatorController@removeRole') -> middleware('auth');

    Route::apiResource('postGraduateProgramReviews', 'PostGraduateProgramReviewController');

    Route::apiResource('pgprApplications', 'PostGraduateProgramReviewApplicationController') -> middleware('auth');
    Route::apiResource('iqauDirectors', 'InternalQualityAssuranceUnitDirectorController') -> middleware('auth');
    //other routes of the iqauDirectors
        //remove role of iqau director
        Route::post('iqauDirectors/{iqauDirector}/removeRole', 'InternalQualityAssuranceUnitDirectorController@removeRole') -> middleware('auth');

    Route::apiResource('iqaUnits', 'InternalQualityAssuranceUnitController');
    Route::apiResource('faculties', 'FacultyController') -> middleware('auth');
    //other routes of the faculties
        //get the university of the faculty
        Route::get('faculties/{faculty}/university', 'FacultyController@university') -> middleware('auth');
        //get the current dean of the faculty
        Route::get('faculties/{faculty}/currentDean', 'FacultyController@currentDean') -> middleware('auth');
        //get the post graduate programs of the faculty
        Route::get('faculties/{faculty}/postGraduatePrograms', 'FacultyController@postGraduatePrograms') -> middleware('auth');


    Route::apiResource('evidences', 'EvidenceController') -> middleware('auth');
    Route::apiResource('deskEvaluations', 'DeskEvaluationController');
    Route::apiResource('deans', 'DeanController');
    //other routes of the deans
        //get the faculty of the dean
        Route::get('deans/{dean}/faculty', 'DeanController@faculty') -> middleware('auth');
        //remove role of dean
        Route::post('deans/{dean}/removeRole', 'DeanController@removeRole') -> middleware('auth');

    Route::apiResource('criterias', 'CriteriaController');
    Route::apiResource('cqaDirectors', 'CenterForQualityAssuranceDirectorController');
    //other routes of the cqa directors
        Route::post('cqaDirectors/{cqaDirector}/removeRole', 'CenterForQualityAssuranceDirectorController@removeRole') -> middleware('auth');

    Route::apiResource('centerForQualityAssurances', 'CenterForQualityAssuranceController');
    Route::apiResource('academicStaffs', 'AcademicStaffController');

    //route for reviewer import from excel
    Route::post('reviewers/import', 'ReviewerController@importReviewers')->middleware('auth');
    //ROUTES OF THE REVIEWER ACTOR
    //get the appointment declaration
    Route::get('reviewers/download-declaration', 'ReviewerController@downloadRoleAcceptanceDeclarationLetter')->middleware('auth');
    //get the prgprs of the reviewer
    Route::get('reviewers/pgprs', 'ReviewerController@browsePGPRs')->middleware('auth');
    //upload the declaration letter
    Route::post('reviewers/accept-appointment', 'ReviewerController@acceptAppointment')->middleware('auth');
    //reject the appointment
    Route::post('reviewers/reject-appointment', 'ReviewerController@rejectAppointment')->middleware('auth');
    //download review team assignment appointment declaration letter
    Route::get('reviewers/download-pgpr-declaration', 'ReviewerController@downloadReviewAppointmentDeclarationLetter')->middleware('auth');
    //accept pgpr assignment
    Route::post('reviewers/accept-pgpr-assignment', 'ReviewerController@acceptPGPRAssignment')->middleware('auth');
    //reject pgpr assignment
    Route::post('reviewers/reject-pgpr-assignment', 'ReviewerController@rejectPGPRAssignment')->middleware('auth');
    //display reviewer profile
    Route::get('reviewers/display-reviewer-profile', 'ReviewerController@displayReviewerProfile')->middleware('auth');
    //display desk evaluations of user
    Route::get('/reviewers/reviewer-desk-evaluations', 'ReviewerController@reviewerDeskEvaluations')->middleware('auth');
    //display proper evaluations of user
    Route::get('/reviewers/reviewer-proper-evaluations', 'ReviewerController@reviewerProperEvaluations')->middleware('auth');
    // api resource => this must come here otherwise the declaration doc will have problems
    Route::apiResource('reviewers', 'ReviewerController')->middleware('auth');

    //route for google drive file info (for now, only the metadata is returned (testing))
    Route::post('driveFileInfo', 'GoogleDriveController@getFileInfo');
    Route::get('downloadFile', 'GoogleDriveController@downloadFile');
    Route::get('isFolder', 'GoogleDriveController@isFolder');
    Route::get('checkPermission', 'GoogleDriveController@checkPermission');
    Route::post('createFolder', 'GoogleDriveController@createFolder');
    Route::post('copyContent', 'GoogleDriveController@copyContent');

    //other routes for pgpr application
    Route::post('pgprApplications/{pgprApplication}/submit', 'PostGraduateProgramReviewApplicationController@submit') -> middleware('auth');  //submit pgpr application by the dean
    Route::post('pgprApplications/{pgprApplication}/cqaDirectorApprove', 'PostGraduateProgramReviewApplicationController@cqaDirectorRecommendation') -> middleware('auth'); //approve pgpr application by the cqa director
    Route::post('pgprApplications/{pgprApplication}/qacOfficerApproval', 'PostGraduateProgramReviewApplicationController@qacOfficerApproval') -> middleware('auth');//approve pgpr application by the qac officer

    //routes for self evaluation report methods
    Route::post('selfEvaluationReports/{selfEvaluationReport}/addAdherenceToStandards', 'SelfEvaluationReportController@addAdherenceToStandards') -> middleware('auth');
    Route::get('selfEvaluationReports/{selfEvaluationReport}/getStandards/{criteria}', 'SelfEvaluationReportController@getStandards') -> middleware('auth');
    Route::get('selfEvaluationReports/{selfEvaluationReport}/getStandardEvidencesAndAdherence/{standard}', 'SelfEvaluationReportController@getStandardEvidencesAndAdherence') -> middleware('auth');
    Route::post('selfEvaluationReports/{selfEvaluationReport}/submitSelfEvaluationReport', 'SelfEvaluationReportController@submitSelfEvaluationReport') -> middleware('auth');
    Route::post('selfEvaluationReports/{selfEvaluationReport}/recommendSelfEvaluationReport', 'SelfEvaluationReportController@recommendSelfEvaluationReport') -> middleware('auth');
});
