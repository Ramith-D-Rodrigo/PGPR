<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeskEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_date',
        'end_date',
        'status',
    ];

    // Desk Evaluation belongs to a PostGraduateReviewProgram
    public function postGraduateProgramReview(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PostGraduateProgramReview::class, 'pgpr_id', 'id');
    }

    // desk evaluation has 7(many) standards and associated scores
    public function standards(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Standard::class,
            'desk_evaluation_score',
            'desk_evaluation_id',
            'standard_id' // the column in the relating model
        )->withPivot(['desk_evaluation_id', 'reviewer_id', 'de_score', 'comment']);
    }
}
