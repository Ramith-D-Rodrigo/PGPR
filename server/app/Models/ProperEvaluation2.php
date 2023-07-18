<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProperEvaluation2 extends Model
{
    use HasFactory;

    protected $table = 'proper_evaluation_1s';

    // the proper evaluation 2 belongs to a ProperEvaluation
    public function properEvaluation()
    {
        return $this->belongsTo(ProperEvaluation::class);
    }
}
