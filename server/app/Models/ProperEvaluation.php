<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProperEvaluation extends Model
{
  use HasFactory;

  // Proper Evaluation belongs to a PostGraduateReviewProgram
  public function postGraduateProgramReview()
  {
    return $this->belongsTo(PostGraduateProgramReview::class, 'pgpr_id', 'id');
  }

  // proper evaluation has 7(many) standards and associated scores
  public function standards()
  {
      return $this->belongsToMany(
          Standard::class,
          'proper_evaluation_score',
          'proper_evaluation_id',
          'standard_id' // the column in the relating model
      )->withPivot('pe_score');
  }
}
