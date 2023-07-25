<?php

//this service class is used for services related to academic staff of university side

namespace App\Services\V1;

use App\Models\AcademicStaff;
use App\Models\UniversitySide;
use App\Services\V1\UniversitySideService;
use Illuminate\Database\Eloquent\Model;

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

        $validatedData['postgraduate_qualifications'] = json_encode([
                'qualification_1' => [
                    'qualification' => $validatedData['qualification_1'],
                    'slqf_level' => $validatedData['qualification_1_slqf_level']
                ],
                'qualification_2' => [
                    'qualification' => $validatedData['qualification_2'],
                    'slqf_level' => $validatedData['qualification_2_slqf_level']
                ],
                'qualification_3' => [
                    'qualification' => $validatedData['qualification_3'],
                    'slqf_level' => $validatedData['qualification_3_slqf_level']
                ],
                'qualification_4' => [
                    'qualification' => $validatedData['qualification_4'],
                    'slqf_level' => $validatedData['qualification_4_slqf_level']
                ]
            ]);

        $academicStaff -> fill($validatedData);
        $academicStaff -> id = $universitySide -> id;

        $academicStaff -> save();

        return $academicStaff; //return the academic staff object and the password (password for sending the email)

    }
}
