<?php

namespace App\Filters\V1;

class ProgrammeCoordinatorFilter extends ApiFilter{
    protected $safeParams = [
        'facultyId' => ['eq', 'neq','in', 'nin'],
        'postGradProgramId' => ['eq', 'neq','in', 'nin'],
        'assignedDate' => ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
        'currentStatus' => ['eq', 'neq', 'in', 'nin']
    ];

    protected $columnMap = [
        'facultyId' => 'faculty_id',
        'postGradProgramId' => 'post_grad_program_id',
        'assignedDate' => 'assigned_date',
        'currentStatus' => 'current_status'
    ];
}
