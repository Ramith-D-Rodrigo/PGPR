<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1'], function () {
    //all routes that belong to v1 version of the API will go here
    //for now, the routes for all the controllers are defined
    //later we can remove the routes that are not needed
    Route::apiResource('viceChancellors', 'ViceChancellorController');
    Route::apiResource('users', 'UserController');
    Route::apiResource('universitySides', 'UniversitySideController');
    Route::apiResource('universities', 'UniversityController');
    Route::apiResource('standards', 'StandardController');
    Route::apiResource('selfEvaluationReports', 'SelfEvaluationReportController');
    Route::apiResource('reviewTeams', 'ReviewTeamController');
    Route::apiResource('reviewers', 'ReviewerController');
    Route::apiResource('qualityAssuranceStaffs', 'QualityAssuranceStaffController');
    Route::apiResource('qacOfficers', 'QualityAssuranceCouncilOfficerController');
    Route::apiResource('qacDirectors', 'QualityAssuranceCouncilDirectorController');
    Route::apiResource('properEvaluations', 'ProperEvaluationController');
    Route::apiResource('programmeCoordinators', 'ProgrammeCoordinatorController');
    Route::apiResource('postGraduateProgramReviews', 'PostGraduateProgramReviewController');
    Route::apiResource('pgprApplications', 'PostGraduateProgamReviewApplicationController');
    Route::apiResource('postGraduatePrograms', 'PostGraduateProgramController');
    Route::apiResource('iqauDirectors', 'InternalQualityAssuranceUnitDirectorController');
    Route::apiResource('iqaUnits', 'InternalQualityAssuranceUnitsController');
    Route::apiResource('faculties', 'FacultyController');
    Route::apiResource('deskEvaluations', 'DeskEvaluationController');
    Route::apiResource('deans', 'DeanController');
    Route::apiResource('criterias', 'CriteriaController');
    Route::apiResource('cqaDirectors', 'CenterForQualityAssuranceDirectorController');
    Route::apiResource('centerForQualityAssurances', 'CenterForQualityAssurancesController');
    Route::apiResource('academicStaffs', 'AcademicStaffController');
});
