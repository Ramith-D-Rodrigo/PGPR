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


    //TODO: Renamed route names should reflect on the method names in the controllers
    Route::apiResource('viceChancellors', 'ViceChancellorController');
    Route::apiResource('users', 'UserController');
    Route::apiResource('universitySides', 'UniversitySideController');
    Route::apiResource('universities', 'UniversityController')->middleware('auth');
    Route::apiResource('standards', 'StandardController');
    Route::apiResource('selfEvaluationReports', 'SelfEvaluationReportController');
    Route::apiResource('reviewTeams', 'ReviewTeamController');
    Route::apiResource('qualityAssuranceStaffs', 'QualityAssuranceStaffController');
    Route::apiResource('qacOfficers', 'QualityAssuranceCouncilOfficerController');
    Route::apiResource('qacDirectors', 'QualityAssuranceCouncilDirectorController');
    Route::apiResource('properEvaluations', 'ProperEvaluationController');
    Route::apiResource('programmeCoordinators', 'ProgrammeCoordinatorController');
    Route::apiResource('postGraduateProgramReviews', 'PostGraduateProgramReviewController');
    Route::apiResource('pgprApplications', 'PostGraduateProgramReviewApplicationController')->middleware('auth');
    Route::apiResource('postGraduatePrograms', 'PostGraduateProgramController')->middleware('auth');
    Route::apiResource('iqauDirectors', 'InternalQualityAssuranceUnitDirectorController');
    Route::apiResource('iqaUnits', 'InternalQualityAssuranceUnitController');
    Route::apiResource('faculties', 'FacultyController')->middleware('auth');
    Route::apiResource('deskEvaluations', 'DeskEvaluationController');
    Route::apiResource('deans', 'DeanController');
    Route::apiResource('criterias', 'CriteriaController');
    Route::apiResource('cqaDirectors', 'CenterForQualityAssuranceDirectorController');
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

    //other routes for pgpr application
    Route::post('pgprApplications/{pgprApplication}/submit', 'PostGraduateProgramReviewApplicationController@submit')->middleware('auth');  //submit pgpr application by the dean
});
