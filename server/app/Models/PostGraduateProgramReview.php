<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function Symfony\Component\String\u;

class PostGraduateProgramReview extends Model
{
  use HasFactory;

  protected $fillable = [
    'post_graduate_program_id',
    'qac_dir_id',
    'status_of_pgpr',
    'payment_voucher',
    'grouped_with',
    'action_plan',
    'preliminary_report',
    'pgpr_application_id'
  ];

/*  // a post graduate review program has one desk evaluation
  public function deskEvaluations()
  {
    return $this->hasOne(DeskEvaluation::class, 'de_id', 'id');
  }

  // a post graduate review program has one proper evaluation
  public function poperEvaluations()
  {
    return $this->hasOne(ProperEvaluation::class, 'pe_id', 'id');
  }*/

  // pgpr sentIntentLetter relation
  public function deans()
  {
      return $this->belongsTo(Dean::class, 'dean_id', 'id');
  }

/*  // pgpr has a review team associated with itself
  public function reviewTeams()
  {
      return $this->hasOne(PostGraduateProgramReview::class, 'review_team_id');
  }*/

  public function postGraduateProgram()
  {
      return $this->belongsTo(PostGraduateProgram::class, 'post_graduate_program_id', 'id');
  }

  //pgpr has a self evaluation report
    public function selfEvaluationReport()
    {
        return $this->hasOne(SelfEvaluationReport::class, 'post_graduate_program_review_id', 'id');
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

  //post graduate program review has many post graduate program review applications
    public function postGraduateProgramReviewApplication(){
        return $this->belongsTo(PostGraduateProgramReviewApplication::class, 'pgpr_application_id', 'id');
    }
}
