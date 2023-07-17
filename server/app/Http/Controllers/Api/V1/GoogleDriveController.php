<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\V1\DriveFileChecker;
use App\Http\Resources\V1\DriveFileInfoResource;

class GoogleDriveController extends Controller
{
    public function getFileInfo(Request $request) {
        $url = $request -> url;
        $neededFields = $request -> fields;
        $driveFileChecker = new DriveFileChecker();
        $fileInfo = $driveFileChecker -> getFileInfo($url, $neededFields);
        return new DriveFileInfoResource(json_encode($fileInfo));
    }
}
