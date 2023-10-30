<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgrammeCoordinator extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'post_grad_program_id',
        'assigned_date',
        'current_status'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    //program coordinator is an academic staff
    public function academicStaff(): BelongsTo
    {
        return $this->belongsTo(AcademicStaff::class, 'id', 'id');
    }

    // program coordinator belongs to a post graduate program
    public function postGraduateProgram(): BelongsTo
    {
        return $this->belongsTo(PostGraduateProgram::class, 'post_grad_program_id', 'id');
    }
}
