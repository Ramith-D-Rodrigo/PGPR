<?php

//this service class is used for services related to academic staff of university side

namespace App\Services\V1;

use App\Models\AcademicStaff;
use App\Models\UniversitySide;
use App\Services\V1\UniversitySideService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AcademicStaffService extends UniversitySideService {
    public static function create(array $validatedData) : Model {
        //make sure validated data has status, staff_position fields and the roles field
        $universitySide = parent::create($validatedData); //call the parent create function to create the and get the university side model

        $academicStaff = new AcademicStaff();
        $validatedData['department'] = json_encode(
            [
                'name' => $validatedData['department_name'],
                'head_name' => $validatedData['department_head_name'],
                'head_email' => $validatedData['department_head_email'],
                'postal_address' => $validatedData['department_postal_address']
            ]
        );

        $validatedData['postgraduate_qualifications'] = self::concatPostgraudateQualifications($validatedData);

        $academicStaff -> fill($validatedData);
        $academicStaff -> id = $universitySide -> id;

        $academicStaff -> save();

        return $academicStaff; //return the academic staff object and the password (password for sending the email)

    }

    public static function storeFiles(array $validatedData){
        $validatedData = parent::storeFiles($validatedData); //call the parent storeFiles function to store the files
        $cv = $validatedData['cv'];
        if($cv){ //has uploaded a cv
            $ext = $cv -> getClientOriginalExtension();
            $cvName = $validatedData['official_email'] . '.' . $ext;

            //create the cv directory if it does not exist
            if(!File::exists(public_path('storage/cvs'))){
                File::makeDirectory(public_path('storage/cvs'));
            }

            Storage::put('public/cvs/' . $cvName, $cv -> getContent());

            //get the cv url
            $cvUrl = Storage::url('public/cvs/' . $cvName);
            $validatedData['cv'] = $cvUrl;
        }

        return $validatedData;
    }

    public static function concatPostgraudateQualifications($arr){
        return json_encode([
            'qualification_1' => [
                'qualification' => $arr['qualification_1'],
                'slqf_level' => $arr['qualification_1_slqf_level']
            ],
            'qualification_2' => [
                'qualification' => $arr['qualification_2'],
                'slqf_level' => $arr['qualification_2_slqf_level']
            ],
            'qualification_3' => [
                'qualification' => $arr['qualification_3'],
                'slqf_level' => $arr['qualification_3_slqf_level']
            ],
            'qualification_4' => [
                'qualification' => $arr['qualification_4'],
                'slqf_level' => $arr['qualification_4_slqf_level']
            ]
        ]);
    }
}
