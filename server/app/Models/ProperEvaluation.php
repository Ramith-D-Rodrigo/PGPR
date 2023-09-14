<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProperEvaluation extends Model
{
  use HasFactory;

  // Proper Evaluation belongs to a PostGraduateReviewProgram
  public function postGraduateProgramReview(): \Illuminate\Database\Eloquent\Relations\BelongsTo
  {
    return $this->belongsTo(PostGraduateProgramReview::class, 'pgpr_id', 'id');
  }

  // proper evaluation has 7(many) standards and associated scores
  public function standards(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
  {
      return $this->belongsToMany(
          Standard::class,
          'proper_evaluation_score',
          'proper_evaluation_id',
          'standard_id' // the column in the relating model
      )->withPivot('pe_score');
  }

  public function properEvaluation1(): \Illuminate\Database\Eloquent\Relations\HasOne
  {
      return $this->hasOne(ProperEvaluation1::class, 'id', 'id');
  }

    public function properEvaluation2(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ProperEvaluation2::class, 'id', 'id');
    }
}
