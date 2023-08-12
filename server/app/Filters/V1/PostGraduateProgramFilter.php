<?php

namespace App\Filters\V1;
use Illuminate\Http\Request;

class PostGraduateProgramFilter extends ApiFilter{
    protected $safeParams = [
        'title' => ['eq', 'neq', 'like', 'nlike'],
        'slqfLevel' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
        'commencementYear' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
        'facultyId' => ['eq', 'neq','in', 'nin'],
        'addedByCqaDirectorId' => ['eq', 'neq','in', 'nin'],
        'editedByCqaDirectorId' => ['eq', 'neq','in', 'nin'],
        'programmeCoordinatorId' => ['eq', 'neq','in', 'nin']
    ];

    protected $columnMap = [
        'slqfLevel' => 'slqf_level',
        'commencementYear' => 'commencement_year',
        'facultyId' => 'faculty_id',
        'addedByCqaDirectorId' => 'added_by_cqa_director_id',
        'editedByCqaDirectorId' => 'edited_by_cqa_director_id',
        'programmeCoordinatorId' => 'programme_coordinator_id'
    ];


}
