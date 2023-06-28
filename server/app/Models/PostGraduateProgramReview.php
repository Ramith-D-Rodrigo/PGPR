<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostGraduateProgramReview extends Model
{
  use HasFactory;

  // a post graduate review program has one desk evaluation
  public function deskEvaluations()
  {
    return $this->hasOne(DeskEvaluation::class);
  }

  // a post graduate review program has one proper evaluation
  public function poperEvaluations()
  {
    return $this->hasOne(ProperEvaluation::class);
  }
}
