<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProperEvaluation2 extends Model
{
    use HasFactory;

    protected $table = 'proper_evaluation_1s';

    protected $fillable = [
        'id',
        'start_date',
        'site_visit_start_date',
        'site_visit_end_date',
        'end_date',
        'remark'
    ];

    // the proper evaluation 2 belongs to a ProperEvaluation
    public function properEvaluation()
    {
        return $this->belongsTo(ProperEvaluation::class);
    }
}
