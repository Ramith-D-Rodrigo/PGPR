<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeskEvaluation extends Model
{
  use HasFactory;

  // Desk Evaluation belongs to a PostGraduateReviewProgram
  public function postGraduateProgramReview()
  {
    return $this->belongsTo(PostGraduateProgramReview::class, 'pgpr_id', 'id');
  }

  // desk evaluation has 7(many) standards and associated scores
  public function standards()
  {
      return $this->belongsToMany('desk_evaluation_score')->withPivot('de_score');
  }

}
