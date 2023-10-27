<?php

namespace App\Services\V1;

use App\Models\PostGraduateProgramReview;
use App\Models\QualityAssuranceCouncilDirector;
use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PostGraduateProgramReviewService {

    public static function StoreEvidencesInSystemDrive(PostGraduateProgramReview $pgpr) {
        try{
            //remove time limit
            set_time_limit(0);

            //create drive manager object
           $driveManager = new DriveManager();

            //create a folder for the pgpr
            $pgprFolder = $driveManager -> createFolder("PGPR-".$pgpr -> id, env("GOOGLE_DRIVE_PGPR_PARENT_FOLDER_ID"));

            //get the evidences
            $evidences = $pgpr -> selfEvaluationReport -> evidences;

            //begin transaction
            //DB::beginTransaction(); //transaction is handled by the controller

            //go through each evidence
            foreach($evidences as $evidence){
                //create a folder for the evidence
                $evidenceFolder = $driveManager -> createFolder($evidence -> evidence_code, $pgprFolder -> getId());

                //get the url of the evidence
                $url = $evidence -> url;

                //check if the content of the url is a folder or a file

                $storedUrl = "";
                if($driveManager -> isFolder($url)){
                    //copy the folder
                    $storedUrl = $driveManager -> copyFolder($driveManager -> getFolderId($url), $evidenceFolder -> id) -> getWebViewLink();
                }
                else{
                    //copy the file
                    $storedUrl = $driveManager -> copyFile($driveManager -> getFileId($url), $evidenceFolder -> id) -> getWebViewLink();
                }

                //update the stored id of the evidence
                $evidence -> stored_url = $storedUrl;
                $evidence -> save();
            }

            //set the permission of the pgpr folder
            //these are the people who can view the pgpr folder
            //1) the pgp coordinator of the pgpr
            //2) the vice chancellor of the university that the pgpr belongs to
            //3) the center for quality assurance director of the university that the pgpr belongs to
            //4) the internal quality assurance unit director of the faculty that the pgpr belongs to
            //5) the dean of the faculty that the pgpr belongs to
            //6) reviewers of the pgpr
            //7) qac officers of the quality assurance council
            //8) qac directors of the quality assurance council

            //first get the pgp coordinator of the pgpr
            $pgpCoordinator = $pgpr -> postGraduateProgram -> currentProgrammeCoordinator -> id;
            $viceChancellor = $pgpr -> postGraduateProgram -> faculty -> university -> viceChancellor -> id;
            $cqaDirector = $pgpr -> postGraduateProgram -> faculty -> university -> centerForQualityAssurance -> currentQualityAssuranceDirector -> id;
            $iqauDirector = $pgpr -> postGraduateProgram -> faculty -> internalQualityAssuranceUnit -> internalQualityAssuranceUnitDirector -> id;
            $dean = $pgpr -> postGraduateProgram -> faculty -> currentDean -> id;
            $reviewTeam = $pgpr -> acceptedReviewTeam -> reviewers() -> pluck('reviewer_id') -> toArray();
            //since qac directors are also qac officers, we can get them from the qac officers table
            $qacOfficers = QualityAssuranceCouncilOfficer::all() -> pluck('id') -> toArray();

            //concat all the ids
            $ids = array();
            array_push($ids, $pgpCoordinator);
            array_push($ids, $viceChancellor);
            array_push($ids, $cqaDirector);
            array_push($ids, $iqauDirector);
            array_push($ids, $dean);

            array_push($ids, ...$reviewTeam);
            array_push($ids, ...$qacOfficers);

            //get official emails
            $officialEmails = User::whereIn('id', $ids) -> get(['official_email']) -> toArray();

            //first remove all the permissions of the pgpr folder
            $driveManager -> removePermissionIdWise($pgprFolder -> getId(), 'anyoneWithLink');

            //set the permission of the pgpr folder
            foreach($officialEmails as $email){
                $driveManager -> setPermissions($pgprFolder -> getId(), $email['official_email'], 'reader');
            }

            //commit the transaction
            //DB::commit(); //transaction is handled by the controller
            return true;
        }
        catch(\Exception $e){
            //DB::rollback(); //transaction is handled by the controller
            //if an error occurs, delete all the files and folders created
            $driveManager -> deleteFile($pgprFolder -> id);
            throw $e;
        }
    }
}
