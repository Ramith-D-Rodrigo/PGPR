<?php

namespace App\Services\V1;
use Google\Client;
use Google\Service\Drive;


class DriveManager {
    private $client;
    public function __construct(){
        $this -> client = new Client();
        $this -> client -> setApplicationName("PGPR system");
        $this -> client -> setDeveloperKey(env("GOOGLE_DRIVE_API_KEY"));
    }

    public function getFileInfo($url, array $neededFields = []) {
        $fileId = $this -> getFileId($url);
        $service = new Drive($this -> client);

        $optParams = array(
            'fields' => implode(",", $neededFields)
        );

        $file = $service -> files -> get($fileId, $optParams);
        return $file;
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

    public function getFile($url)  {
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
}
