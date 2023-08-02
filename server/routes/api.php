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
    Route::apiResource('universities', 'UniversityController') -> middleware('auth');
    Route::apiResource('standards', 'StandardController');
    Route::apiResource('selfEvaluationReports', 'SelfEvaluationReportController') -> middleware('auth');
    Route::apiResource('reviewTeams', 'ReviewTeamController');
    Route::apiResource('reviewers', 'ReviewerController');
    Route::apiResource('qualityAssuranceStaffs', 'QualityAssuranceStaffController');
    Route::apiResource('qacOfficers', 'QualityAssuranceCouncilOfficerController');
    Route::apiResource('qacDirectors', 'QualityAssuranceCouncilDirectorController');
    Route::apiResource('properEvaluations', 'ProperEvaluationController');
    Route::apiResource('programmeCoordinators', 'ProgrammeCoordinatorController') -> middleware('auth') -> middleware('authorize.role:cqa_director')->only(['store', 'update', 'destroy']);
    Route::apiResource('postGraduateProgramReviews', 'PostGraduateProgramReviewController');
    Route::apiResource('pgprApplications', 'PostGraduateProgramReviewApplicationController') -> middleware('auth');
    Route::apiResource('postGraduatePrograms', 'PostGraduateProgramController') -> middleware('auth');
    Route::apiResource('iqauDirectors', 'InternalQualityAssuranceUnitDirectorController') -> middleware('auth') -> middleware('authorize.role:cqa_director')->only(['store', 'update', 'destroy']);
    Route::apiResource('iqaUnits', 'InternalQualityAssuranceUnitController');
    Route::apiResource('faculties', 'FacultyController') -> middleware('auth');
    Route::apiResource('evidences', 'EvidenceController') -> middleware('auth') -> middleware('authorize.role:programme_coordinator') -> only(['store', 'update', 'destroy']);
    Route::apiResource('deskEvaluations', 'DeskEvaluationController');
    Route::apiResource('deans', 'DeanController');
    Route::apiResource('criterias', 'CriteriaController');
    Route::apiResource('cqaDirectors', 'CenterForQualityAssuranceDirectorController');
    Route::apiResource('centerForQualityAssurances', 'CenterForQualityAssuranceController');
    Route::apiResource('academicStaffs', 'AcademicStaffController');

    //route for reviewer import from excel
    Route::post('reviewers/import', 'ReviewerController@importReviewers');

    //route for google drive file info (for now, only the metadata is returned (testing))
    Route::post('driveFileInfo', 'GoogleDriveController@getFileInfo');
    Route::get('downloadFile', 'GoogleDriveController@downloadFile');

    //other routes for pgpr application
    Route::post('pgprApplications/{pgprApplication}/submit', 'PostGraduateProgramReviewApplicationController@submit') -> middleware('auth');  //submit pgpr application by the dean
    Route::post('pgprApplications/{pgprApplication}/cqaDirectorApprove', 'PostGraduateProgramReviewApplicationController@cqaDirectorRecommendation') -> middleware('auth') -> middleware('authorize.role:cqa_director');  //approve pgpr application by the cqa director
    Route::post('pgprApplications/{pgprApplication}/qacOfficerApproval', 'PostGraduateProgramReviewApplicationController@qacOfficerApproval') -> middleware('auth') -> middleware('authorize.role:qac_officer');  //approve pgpr application by the qac officer

    //routes for self evaluation report methods
    Route::post('selfEvaluationReports/{selfEvaluationReport}/addAdherenceToStandards', 'SelfEvaluationReportController@addAdherenceToStandards') -> middleware('auth') -> middleware('authorize.role:programme_coordinator');
    Route::get('selfEvaluationReports/{selfEvaluationReport}/getStandardEvidencesAndAdherence/{standard}', 'SelfEvaluationReportController@getStandardEvidencesAndAdherence') -> middleware('auth');
    Route::post('selfEvaluationReports/{selfEvaluationReport}/submitSelfEvaluationReport', 'SelfEvaluationReportController@submitSelfEvaluationReport') -> middleware('auth') -> middleware('authorize.role:programme_coordinator');
});
