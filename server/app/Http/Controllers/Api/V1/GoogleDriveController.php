<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\V1\DriveManager;
use App\Http\Resources\V1\DriveFileInfoResource;
use Illuminate\Support\Str;

class GoogleDriveController extends Controller
{
    public function getFileInfo(Request $request) {
        $url = $request -> url;
        $neededFields = $request -> fields;
        $DriveManager = new DriveManager();
        $fileInfo = $DriveManager -> getFileInfo($url, $neededFields);
        return new DriveFileInfoResource(json_encode($fileInfo));
    }

    public function downloadFile(Request $request){
        $url = $request -> url;
        $DriveManager = new DriveManager();
        $returnArr = $DriveManager -> getFile($url);

        try{
             //store in public of the server
            $fileName = time() . ".". $returnArr['fileExtension']; //generate a unique file name
            $file = file_put_contents(public_path() . "/storage/$fileName", $returnArr['fileContent']);

            return response() -> json([
                'message' => 'File downloaded successfully',
                'file' => $fileName
            ], 200);
        }
        catch(\Exception $e){
            return response() -> json([
                'message' => 'Error downloading file',
                'error' => $e -> getMessage()
            ], 500);
        }

    }
}
