<?php

namespace App\Services\V1;

use App\Jobs\V1\CreatePGPRFolder;
use App\Jobs\V1\SetPermissionsForPGPRFolder;
use App\Jobs\V1\StoreEvidenceInDrive;
use App\Models\PostGraduateProgramReview;
use App\Models\QualityAssuranceCouncilDirector;
use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\User;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

class PostGraduateProgramReviewService {
    public static function CreatePGPRFolder($pgpr){
        //create drive manager object
        $driveManager = new DriveManager();

        //create a folder for the pgpr
        $pgprFolder = $driveManager -> createFolder("PGPR-".$pgpr -> id, env("GOOGLE_DRIVE_PGPR_PARENT_FOLDER_ID"));

        return $pgprFolder;
    }

    public static function StoreSingleEvidenceInSystemDrive($evidence, $pgprFolder) {
        try{
            //create drive manager object
            $driveManager = new DriveManager();
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
        catch(\Exception $e){
            throw $e;
        }
    }

    public static function SetPermissionsOfPGPRFolder($pgprFolder, $pgpr){
        try{
            //create drive manager object
            $driveManager = new DriveManager();

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

            return true;
        }
        catch(\Exception $e){
            throw $e;
        }
    }

    public static function StoreEvidencesInSystemDriveAggregateJob($pgpr){
        //dispath the job to create the pgpr folder
        $pgprFolder = CreatePGPRFolder::dispatchSync($pgpr);

        //create batch jobs for each evidence
        $evidences = $pgpr -> selfEvaluationReport -> evidences;

        $evidenceJobs = [];

        foreach($evidences as $evidence){
            //dispatch the job to store the evidence in system drive
            $storeEvidenceInDriveJob = new StoreEvidenceInDrive($evidence, $pgprFolder);
            $evidenceJobs[] = $storeEvidenceInDriveJob;
        }

        //dispatch the job batch
        $batch = Bus::batch($evidenceJobs)
            -> then(function (Batch $batch) use ($pgpr, $pgprFolder) {
                // All jobs completed successfully...

                //dispatch the job to set the permissions of the pgpr folder
                SetPermissionsForPGPRFolder::dispatch($pgpr, $pgprFolder);
            })
            -> dispatch();
    }
}
