<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProperEvaluation1 extends Model
{
    use HasFactory;
    protected $table = 'proper_evaluation_1s';

    protected $fillable = [
        'id',
        'start_date',
        'pe_1_meeting_date',
        'end_date',
        'remark'
    ];

    // the proper evaluation 1 belongs to a ProperEvaluation
    public function properEvaluation()
    {
        return $this->belongsTo(ProperEvaluation::class);
    }

}
