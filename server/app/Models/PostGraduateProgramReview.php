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
    return $this->hasOne(DeskEvaluation::class, 'de_id', 'id');
  }

  // a post graduate review program has one proper evaluation
  public function poperEvaluations()
  {
    return $this->hasOne(ProperEvaluation::class, 'pe_id', 'id');
  }

  // a pgrp can be created by a single program coordinators
  public function programCoordinators()
  {
      return $this->belongsTo(ProgrammeCoordinator::class, 'coordinator_id', 'id');
  }

  // pgpr sentIntentLetter relation
  public function deans()
  {
      return $this->belongsTo(Dean::class, 'dean_id', 'id');
  }

  // pgpr has a review team associated with itself
  public function reviewTeams()
  {
      return $this->hasOne(PostGraduateProgramReview::class, 'review_team_id');
  }

  public function postGraduatePrograms()
  {
      return $this->belongsTo(PostGraduateProgram::class, 'post_graduate_program_id', 'id');
  }

  // every pgpr has a final report
  public function finalReports()
  {
      return $this->hasOne(FinalReport::class, 'final_report_id');
  }

  // pgprs may be rejected by the QACDiretor
  public function qualityAssuranceCouncilDirectors()
  {
      return $this->belongsTo(QualityAssuranceCouncilDirector::class, 'qac_dir_id', 'id');
  }

  // pgprs can be recommended by vice chancellor
  public function viceChancellors()
  {
      return $this->belongsTo(ViceChancellor::class, 'vice_chancellor_id', 'id');
  }

    // pgprs can be recommended by iqau director
    public function internalQualityAssuranceDirectors()
    {
        return $this->belongsTo(InternalQualityAssuranceUnitDirector::class, 'iqau_dir_id', 'id');
    }

    // pgprs can be recommended by cqu director
    public function centerForQualityAssuranceDirector()
    {
        return $this->belongsTo(CenterForQualityAssuranceDirector::class, 'cqa_dir_id', 'id');
    }
}
