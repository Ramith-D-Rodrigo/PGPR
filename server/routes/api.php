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
    Route::apiResource('postGraduatePrograms', 'PostGraduateProgramController')->middleware('auth');
    //other routes of the postGraduatePrograms
    //get post graduate program reviews of a post graduate program
    Route::get('postGraduatePrograms/{postGraduateProgram}/reviews', 'PostGraduateProgramController@reviews')->middleware('auth');
    //get the faculty of a post graduate program
    Route::get('postGraduatePrograms/{postGraduateProgram}/faculty', 'PostGraduateProgramController@faculty')->middleware('auth');
    //get the current program coordinator of a post graduate program
    Route::get('postGraduatePrograms/{postGraduateProgram}/currentCoordinator', 'PostGraduateProgramController@currentCoordinator')->middleware('auth');

    Route::apiResource('viceChancellors', 'ViceChancellorController');
    //other routes of vice chancellor
    //remove role of vice chancellor
    Route::delete('viceChancellors/{viceChancellor}/removeRole', 'ViceChancellorController@removeRole')->middleware('auth');
    Route::get('viceChancellors/{viceChancellor}/university', 'ViceChancellorController@university')->middleware('auth');

    Route::apiResource('users', 'UserController');
    Route::apiResource('universitySides', 'UniversitySideController');
    Route::apiResource('universities', 'UniversityController')->middleware('auth');
    //other routes of the universities
    //get the current vice chancellor of a university
    Route::get('universities/{university}/currentViceChancellor', 'UniversityController@currentViceChancellor')->middleware('auth');
    //get faculties of a university
    Route::get('universities/{university}/faculties', 'UniversityController@faculties')->middleware('auth');
    Route::get('universities/{university}/postGraduatePrograms/', 'UniversityController@postgraduatePrograms')->middleware('auth');

    Route::apiResource('standards', 'StandardController');
    Route::apiResource('selfEvaluationReports', 'SelfEvaluationReportController')->middleware('auth');
    Route::apiResource('qualityAssuranceStaffs', 'QualityAssuranceStaffController');
    Route::apiResource('qacOfficers', 'QualityAssuranceCouncilOfficerController');
    Route::apiResource('qacDirectors', 'QualityAssuranceCouncilDirectorController');
    Route::apiResource('properEvaluations', 'ProperEvaluationController');
    Route::apiResource('programmeCoordinators', 'ProgrammeCoordinatorController')->middleware('auth');
    //other routes of the programmeCoordinators
    //get the post graduate program of the programme coordinator
    Route::get('programmeCoordinators/{programmeCoordinator}/postGraduateProgram', 'ProgrammeCoordinatorController@postGraduateProgram')->middleware('auth');
    //remove role of programme coordinator
    Route::delete('programmeCoordinators/{programmeCoordinator}/removeRole', 'ProgrammeCoordinatorController@removeRole')->middleware('auth');

    Route::apiResource('postGraduateProgramReviews', 'PostGraduateProgramReviewController');

    Route::apiResource('pgprApplications', 'PostGraduateProgramReviewApplicationController')->middleware('auth');
    Route::apiResource('iqauDirectors', 'InternalQualityAssuranceUnitDirectorController')->middleware('auth');
    //other routes of the iqauDirectors
    //remove role of iqau director
    Route::delete('iqauDirectors/{iqauDirector}/removeRole', 'InternalQualityAssuranceUnitDirectorController@removeRole')->middleware('auth');
    Route::get('iqauDirectors/{iqauDirector}/faculty', 'InternalQualityAssuranceUnitDirectorController@faculty')->middleware('auth');

    Route::apiResource('iqaUnits', 'InternalQualityAssuranceUnitController');
    Route::apiResource('faculties', 'FacultyController')->middleware('auth');
    //other routes of the faculties
    //get the university of the faculty
    Route::get('faculties/{faculty}/university', 'FacultyController@university')->middleware('auth');
    //get the current dean of the faculty
    Route::get('faculties/{faculty}/currentDean', 'FacultyController@currentDean')->middleware('auth');
    //get the post graduate programs of the faculty
    Route::get('faculties/{faculty}/postGraduatePrograms', 'FacultyController@postGraduatePrograms')->middleware('auth');
    //get the current iqau director of the faculty
    Route::get('faculties/{faculty}/currentIQAUDirector', 'FacultyController@currentIQAUDirector')->middleware('auth');


    Route::apiResource('evidences', 'EvidenceController')->middleware('auth');

    Route::apiResource('deans', 'DeanController');
    //other routes of the deans
    //get the faculty of the dean
    Route::get('deans/{dean}/faculty', 'DeanController@faculty')->middleware('auth');
    //remove role of dean
    Route::delete('deans/{dean}/removeRole', 'DeanController@removeRole')->middleware('auth');
    Route::apiResource('criterias', 'CriteriaController');
    Route::apiResource('cqaDirectors', 'CenterForQualityAssuranceDirectorController');
    //other routes of the cqa directors
    Route::delete('cqaDirectors/{cqaDirector}/removeRole', 'CenterForQualityAssuranceDirectorController@removeRole')->middleware('auth');
    Route::get('cqaDirectors/{cqaDirector}/university', 'CenterForQualityAssuranceDirectorController@university')->middleware('auth');

    Route::apiResource('centerForQualityAssurances', 'CenterForQualityAssuranceController');
    Route::apiResource('academicStaffs', 'AcademicStaffController');

    //route for reviewer import from excel
    Route::post('reviewers/import', 'ReviewerController@importReviewers')->middleware('auth');
    //ROUTES OF THE REVIEWER ACTOR
    //get the appointment declaration
    Route::get('reviewers/download-declaration', 'ReviewerController@downloadRoleAcceptanceDeclarationLetter')->middleware('auth');
    //get the pgprs of the reviewer
    Route::get('reviewers/pgprs', 'ReviewerController@browsePGPRs')->middleware('auth');
    //get the specific pgpr of the reviewer
    Route::get('reviewers/pgprs/{pgprId}', 'ReviewerController@viewSpecificPGPR')->middleware('auth');
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
    Route::get('reviewers/reviewer-desk-evaluations', 'ReviewerController@reviewerDeskEvaluations')->middleware('auth');
    //display proper evaluations of user
    Route::get('reviewers/reviewer-proper-evaluations', 'ReviewerController@reviewerProperEvaluations')->middleware('auth');
    //reviewer display desk evaluation remarks (with scores if marked) +> URL params deskEvaluation=10&criteria=12&standard=8
    Route::get('reviewer/desk-evaluation/display-remarks', 'DeskEvaluationController@getDeskEvaluationRemarkAndScoreForStandard')->middleware('auth');
    //reviewer display the standards of a criteria with scores and comments +> URL params deskEvaluation=10&criteria=12
    Route::get('reviewer/desk-evaluation/criteria/display-remarks-scores', 'DeskEvaluationController@viewStandardWiseDetailsOfEachCriteriaInDE')->middleware('auth');
    //reviewer display the progress the reviewer has made in the desk evaluation +> URL params deskEvaluation=12&criteria=10
    Route::get('reviewer/desk-evaluation/view-progress', 'ReviewerController@viewOwnDeskEvaluationCriteria')->middleware('auth');
    //reviewer display the progress the reviewer has made in the proper evaluation +> URL params properEvaluation=12&criteria=10
    Route::get('reviewer/proper-evaluation/view-progress', 'ReviewerController@viewOwnProperEvaluationCriteria')->middleware('auth');
    //reviewer submit desk evaluation
    Route::get('reviewer/submit-desk-evaluation', 'ReviewerController@submitDeskEvaluation')->middleware('auth');
    //reviewer submit proper evaluation
    Route::get('reviewer/submit-proper-evaluation', 'ReviewerController@submitProperEvaluation')->middleware('auth');
    //reviewer view remarks of the sections A,B, and D in the SER
    Route::get('reviewer/pgpr/ser-remarks/view/{serId}', 'ReviewerController@viewRemarksOfSectionsABD')->middleware('auth');
    //reviewer update remarks of the sections A,B, and D in the SER
    Route::post('reviewer/pgpr/ser-remarks/update', 'ReviewerController@viewRemarksOfSectionsABD')->middleware('auth');
    //reviewer conduct desk evaluation
    Route::post('reviewer/conduct/desk-evaluation', 'ReviewerController@conductDeskEvaluation')->middleware('auth');
    //reviewer conduct proper evaluation
    Route::post('reviewer/conduct/proper-evaluation', 'ReviewerController@conductProperEvaluation')->middleware('auth');
    //reviewer view own desk evaluation criteria
    Route::get('reviewer/view/own-desk-evaluation-criteria/{deskEvaluation}/{criteria}', 'ReviewerController@viewOwnDeskEvaluationCriteria')->middleware('auth');
    //reviewer view own proper evaluation criteria
    Route::get('reviewer/view/own-proper-evaluation-criteria/{pgpr}/{properEvaluation}/{criteria}', 'ReviewerController@viewOwnProperEvaluationCriteria')->middleware('auth');
    //reviewer submit desk evaluation
    Route::post('reviewer/submit/desk-evaluation', 'ReviewerController@submitDeskEvaluation')->middleware('auth');
    //reviewer submit proper evaluation
    Route::post('reviewer/submit/proper-evaluation', 'ReviewerController@submitProperEvaluation')->middleware('auth');
    //reviewer reject pgpr in de if the evidences aren't up to the standards
    Route::post('reviewer/reject-pgpr-in-evaluation', 'ReviewerController@rejectPGPRInEvaluation')->middleware('auth');

    //REVIEW TEAM CHAIR ENDPOINTS
    //review team chair assign criteria to team members (including himself)
    Route::post('review-team-chair/proper-evaluation/assign-criteria', 'ReviewTeamChairController@assignReviewTeamMembersCriteriaForProperEvaluation')->middleware('auth');
    //review team chair view review team desk evaluation progress
    Route::get('review-team-chair/desk-evaluation/view-progress/{reviewTeam}/{deskEvaluation}', 'ReviewTeamChairController@viewReviewTeamDeskEvaluationProgress')->middleware('auth');
    //review team chair view review team proper evaluation progress
    Route::get('review-team-chair/proper-evaluation/view-progress/{pgpr}/{reviewTeam}/{properEvaluation}', 'ReviewTeamChairController@viewReviewTeamProperEvaluationProgress')->middleware('auth');
    //review team chair view review team desk evaluation scores
    Route::get('review-team-chair/desk-evaluation/view-scores//{pgpr}/{criteria}/{standard}', 'ReviewTeamChairController@viewDEScoresOfEachStandardOfEachProjectMember')->middleware('auth');
    //review team chair view review team proper evaluation scores
    Route::get('review-team-chair/proper-evaluation/view-scores/{pgpr}/{criteria}/{standard}', 'ReviewTeamChairController@viewPEScoresOfEachStandardOfEachProjectMember')->middleware('auth');
    //review team chair update review team desk evaluation scores
    Route::post('review-team-chair/desk-evaluation/update-scores', 'ReviewTeamChairController@updateDEScoresOfEachStandard')->middleware('auth');
    //review team chair update review team proper evaluation scores
    Route::post('review-team-chair/proper-evaluation/update-scores', 'ReviewTeamChairController@updatePEScoresOfEachStandard')->middleware('auth');

    //REVIEW TEAM ENDPOINTS
    //reviewer view proper evaluation details of the review team (could be either review team head or a member)
    Route::get('review-team/proper-evaluation/view-details/{pgpr}/{reviewTeam}', 'ReviewTeamController@viewProperEvaluationDetails')->middleware('auth');
    //reviewer view final grades of the desk evaluation given by the review team
    Route::get('review-team/desk-evaluation/view-final-grades/{pgpr}', 'ReviewTeamController@viewFinalGradesOfDeskEvaluation')->middleware('auth');
    //reviewer view final grades of the proper evaluation given by the review team
    Route::get('review-team/proper-evaluation/view-final-grades/{pgpr}', 'ReviewTeamController@viewFinalGradesOfProperEvaluation')->middleware('auth');
    //api resource of the review team
    Route::apiResource('review-team', 'ReviewTeamController');

    //DESK EVALUATION ENDPOINTS
    //reviewer view standard wise details of desk evaluation
    Route::get('reviewer/desk-evaluation/view-standard-wise-details/{deskEvaluation}/{criteria}', 'DeskEvaluationController@viewStandardWiseDetailsOfEachCriteriaInDE')->middleware('auth');
    //reviewer get desk evaluation remark and score for a standard
    Route::get('reviewer/desk-evaluation/view-standard-wise-evaluation/{deskEvaluation}/{criteria}/{standard}', 'DeskEvaluationController@getDeskEvaluationRemarkAndScoreForStandard')->middleware('auth');
    //api resource of the desk evaluation
    Route::apiResource('desk-evaluation', 'DeskEvaluationController');

    // api resource => this must come here otherwise the declaration doc will have problems
    Route::apiResource('reviewers', 'ReviewerController')->middleware('auth');

    // dean accepts an appointed review team
    Route::post('deans/acceptReviewTeam', 'DeanController@acceptReviewTeam')->middleware('auth');
    // dean rejects an appointed review team
    Route::post('deans/rejectReviewTeam', 'DeanController@rejectReviewTeam')->middleware('auth');
    // dean api resources
    Route::apiResource('deans', 'DeanController');

    //route for google drive file info (for now, only the metadata is returned (testing))
    Route::post('driveFileInfo', 'GoogleDriveController@getFileInfo');
    Route::get('downloadFile', 'GoogleDriveController@downloadFile');
    Route::get('isFolder', 'GoogleDriveController@isFolder');
    Route::get('checkPermission', 'GoogleDriveController@checkPermission');
    Route::post('createFolder', 'GoogleDriveController@createFolder');
    Route::post('copyContent', 'GoogleDriveController@copyContent');

    //other routes for pgpr application
    Route::post('pgprApplications/{pgprApplication}/submit', 'PostGraduateProgramReviewApplicationController@submit')->middleware('auth');  //submit pgpr application by the dean
    Route::post('pgprApplications/{pgprApplication}/cqaDirectorApprove', 'PostGraduateProgramReviewApplicationController@cqaDirectorRecommendation')->middleware('auth'); //approve pgpr application by the cqa director
    Route::post('pgprApplications/{pgprApplication}/qacOfficerApproval', 'PostGraduateProgramReviewApplicationController@qacOfficerApproval')->middleware('auth'); //approve pgpr application by the qac officer

    //routes for self evaluation report methods
    Route::post('selfEvaluationReports/{selfEvaluationReport}/addAdherenceToStandards', 'SelfEvaluationReportController@addAdherenceToStandards')->middleware('auth');
    Route::get('selfEvaluationReports/{selfEvaluationReport}/getStandards/{criteria}', 'SelfEvaluationReportController@getStandards')->middleware('auth');
    Route::get('selfEvaluationReports/{selfEvaluationReport}/getStandardEvidencesAndAdherence/{standard}', 'SelfEvaluationReportController@getStandardEvidencesAndAdherence')->middleware('auth');
    Route::post('selfEvaluationReports/{selfEvaluationReport}/submitSelfEvaluationReport', 'SelfEvaluationReportController@submitSelfEvaluationReport')->middleware('auth');
    Route::post('selfEvaluationReports/{selfEvaluationReport}/recommendSelfEvaluationReport', 'SelfEvaluationReportController@recommendSelfEvaluationReport')->middleware('auth');
});
