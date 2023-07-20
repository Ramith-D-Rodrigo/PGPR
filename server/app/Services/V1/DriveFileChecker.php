<?php

namespace App\Services\V1;
use Google\Client;
use Google\Service\Drive;


class DriveFileChecker {
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
}
