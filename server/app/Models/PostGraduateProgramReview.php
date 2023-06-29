<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function Symfony\Component\String\u;

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

  // a pgrp can be created by a single program coordinators
  public function programCoordinators()
  {
      return $this->belongsTo(ProgrammeCoordinator::class);
  }

  // pgpr sentIntentLetter relation
  public function deans()
  {
      return $this->belongsTo(Dean::class);
  }

  // pgpr has a review team associated with itself
  public function reviewTeams()
  {
      return $this->hasOne(PostGraduateProgramReview::class);
  }

  public function postGraduatePrograms()
  {
      return $this->belongsTo(PostGraduateProgram::class);
  }

  // every pgpr has a final report
  public function finalReports()
  {
      return $this->hasOne(FinalReport::class);
  }

  // pgprs may be rejected by the QACDiretor
  public function qualityAssuranceCouncilDirectors()
  {
      return $this->belongsToMany(QualityAssuranceCouncilDirector::class);
  }

  // pgprs can be recommended by vice chancellor
  public function viceChancellors()
  {
      return $this->belongsTo(ViceChancellor::class);
  }

    // pgprs can be recommended by iqau director
    public function internalQualityAssuranceDirectors()
    {
        return $this->belongsTo(InternalQualityAssuranceUnitDirector::class);
    }

    // pgprs can be recommended by cqu director
    public function centerForQualityAssuranceDirector()
    {
        return $this->belongsTo(CenterForQualityAssuranceDirector::class);
    }
}
