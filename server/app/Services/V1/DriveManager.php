<?php

namespace App\Services\V1;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;

class DriveManager {
    private $client;
    public function __construct(){
        $this -> client = new Client();
        $this -> client -> setApplicationName("PGPR system");
        $this -> client -> setAuthConfig(base_path(env("GOOGLE_DRIVE_JSON_KEY_PATH")));
    }

    public function getFileInfo($url, array $neededFields = []) {
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE_READONLY]);

        $fileId = $this -> getFileId($url);
        $service = new Drive($this -> client);

        $optParams = array(
            'fields' => implode(",", $neededFields)
        );

        $file = $service -> files -> get($fileId, $optParams);
        return $file;
    }

    //function for checking permissions of a file or folder
    public function getPermissions($id, $optParams = []){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE_READONLY]);

        $service = new Drive($this -> client);
        $permission = $service -> permissions -> listPermissions($id, $optParams);
        return $permission -> getPermissions();
    }

    public function getFileId($url) {
        $fileId = "";
        $url = explode("/", $url);  //cut the url into parts
        foreach($url as $key => $part) {
            if($part == "d") {  //if the part is "d" then the next part is the file id
                $fileId = $url[$key + 1];
                break;
            }
        }
        return $fileId;
    }

    public function getFolderId($url){
        $folderId = "";
        $url = explode("/", $url);  //cut the url into parts
        foreach($url as $key => $part) {
            if($part == "folders") {  //if the part is "folders" then the next part is the folder id
                //remove ?usp=sharing or ?usp=drive_link from the folder id
                $url[$key + 1] = explode("?", $url[$key + 1])[0];
                $folderId = $url[$key + 1];
                break;
            }
        }

        return $folderId;
    }

    public function getFile($url)  {
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE_READONLY]);

        $fileId = $this -> getFileId($url);

        $service = new Drive($this -> client); //create a new drive service
        $response = $service -> files -> get($fileId, array( 'alt' => 'media')); //get the file content

        $response2 = $service -> files -> get($fileId, array('fields' => 'fullFileExtension')); //get the file extension

        return ["fileContent" => $response -> getBody() -> getContents(),
                "fileExtension" => $response2 -> getFullFileExtension()]; //return the file content and its extension
    }

    public function uploadFile($file){ //upload the file to system's google drive
/*         $service = new Drive($this -> client);
        $fileMetadata = new \Google_Service_Drive_DriveFile(array(
            'name' => $file -> getClientOriginalName(),
            'parents' => array(env("GOOGLE_DRIVE_FOLDER_ID"))
        ));
        $content = file_get_contents($file -> getRealPath());
        $file = $service -> files -> create($fileMetadata, array(
            'data' => $content,
            'mimeType' => $file -> getClientMimeType(),
            'uploadType' => 'multipart',
            'fields' => 'id'));
        return $file; */

    }

    public function isFolder($url){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE_READONLY]);

        $fileId = $this -> getFileId($url);
        if($fileId == ""){
            $fileId = $this -> getFolderId($url);
        }

        $service = new Drive($this -> client);
        $file = $service -> files -> get($fileId, array('fields' => 'mimeType'));
        return $file -> getMimeType() == "application/vnd.google-apps.folder";
    }

    public function createFolder($folderName, $parentID = null, Permission $permission = null){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE]);

        if($parentID == null){
            $parentID = env("GOOGLE_DRIVE_PGPR_PARENT_FOLDER_ID");
        }

        $service = new Drive($this -> client);

        //create a new folder with the given name and parent id
        $fileMetadata = new DriveFile(array(
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => array($parentID)
        ));

        $file = $service -> files -> create($fileMetadata, array(
            'fields' => 'id'
        ));

        return $file; //return the id of the created folder
    }


    public function setPermissions($id, $email, $role){
        //valid roles are owner, organizer, fileOrganizer, writer, commenter, reader
        try{
            //set the scope of the client
            $this -> client -> setScopes([Drive::DRIVE]);

            $service = new Drive($this -> client);

            //create a new permission with the given email and role
            $permission = new Permission();

            $permission -> setType("user");
            $permission -> setRole($role);
            $permission -> setEmailAddress($email);

            $service -> permissions -> create($id, $permission, array(
                'sendNotificationEmail' => false
            )); //set the permission to the given file or folder
            return true;
        }
        catch(\Exception $e){
            return $e -> getMessage();
        }
    }

    public function copyFile($fileId, $pasteLocationId = null){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE]);

        if($pasteLocationId == null){
            $pasteLocationId = env("GOOGLE_DRIVE_PGPR_PARENT_FOLDER_ID");
        }

        $service = new Drive($this -> client);

        $pastingFile = new DriveFile(array(
            'parents' => array($pasteLocationId),
            'name' => $service -> files -> get($fileId, array('fields' => 'name')) -> getName()
        ));

        //copy the content of the given file or folder to the given location
        $file = $service -> files -> copy($fileId, $pastingFile);

        return $file -> getId(); //return the id of the copied file or folder
    }

    public function copyFolder($folderId, $pasteLocationId = null){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE]);

        if($pasteLocationId == null){
            $pasteLocationId = env("GOOGLE_DRIVE_PGPR_PARENT_FOLDER_ID");
        }

        $service = new Drive($this -> client);

        //since we cannot copy a folder directly, we need to copy the content of the folder to the given location
        //first create a new folder with the same name as the folder we want to copy
        $folderName = $service -> files -> get($folderId, array('fields' => 'name')) -> getName();
        $file = $this -> createFolder($folderName, $pasteLocationId);

        //now get all the files and folders inside the folder we want to copy
        //do not include trashed files
        $children = $service -> files -> listFiles(array(
            'q' => "'".$folderId."' in parents and trashed = false",
            'fields' => 'files(id, name, mimeType)'
        ));

        //go through all the children and if it is a folder, call this function recursively
        $pasteLocationId = $file -> getId();    //set the paste location to the newly created folder

        foreach($children -> getFiles() as $child){
            if($child -> getMimeType() == "application/vnd.google-apps.folder"){
                $this -> copyFolder($child -> getId(), $pasteLocationId);
            }
            else{
                $this -> copyFile($child -> getId(), $pasteLocationId);
            }
        }

        return $file -> getId(); //return the id of the copied file or folder
    }

    public function removePermissionEmailWise($fileId, $email){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE]);

        $service = new Drive($this -> client);

        //get all the permissions of the given file or folder
        $permissions = $service -> permissions -> listPermissions($fileId, array(
            'fields' => 'permissions(id, emailAddress)'
        ));

        //go through all the permissions and if the email matches, delete the permission
        foreach($permissions -> getPermissions() as $permission){
            if($permission -> getEmailAddress() == $email){
                $service -> permissions -> delete($fileId, $permission -> getId());
                return true;
            }
        }

        return false;
    }

    public function removePermissionIdWise($fileId, $permissionId){
        //set the scope of the client
        $this -> client -> setScopes([Drive::DRIVE]);

        $service = new Drive($this -> client);

        //delete the permission with the given id
        return $service -> permissions -> delete($fileId, $permissionId);
    }
}
