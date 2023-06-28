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
}
