<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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

    // a post graduate review program has one desk evaluation
    public function deskEvaluations(): HasOne
    {
        return $this->hasOne(DeskEvaluation::class, 'pgpr_id');
    }

    // a post graduate review program has one proper evaluation
    public function properEvaluations(): HasOne
    {
        return $this->hasOne(
            ProperEvaluation::class,
            'pgpr_id'
        )->with(['properEvaluation1', 'properEvaluation2']);
    }

    // pgpr sentIntentLetter relation
    public function postGraduateProgramReviewApplication(): BelongsTo
    {
        return $this->belongsTo(PostGraduateProgramReviewApplication::class, 'pgpr_application_id', 'id');
    }

    // pgpr sentIntentLetter relation
    public function deans(): BelongsTo
    {
        return $this->belongsTo(Dean::class, 'dean_id', 'id');
    }

    // pgpr has review teams associated with itself

    public function acceptedReviewTeam(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ReviewTeam::class, 'pgpr_id')->where('status', 'ACCEPTED');
    }

    public function pendingReviewTeam(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ReviewTeam::class, 'pgpr_id')->where('status', 'PENDING');
    }

    //pgpr has only one review team that is accepted by the dean

    public function reviewTeams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ReviewTeam::class, 'pgpr_id');
    }

    public function postGraduateProgram(): BelongsTo
    {
        return $this->belongsTo(PostGraduateProgram::class, 'post_graduate_program_id', 'id');
    }

    //pgpr has a self-evaluation report
    public function selfEvaluationReport(): HasOne
    {
        return $this->hasOne(SelfEvaluationReport::class, 'post_graduate_program_review_id', 'id');
    }

    // every pgpr has a final report
    public function finalReports(): HasOne

    {
        return $this->hasOne(FinalReport::class, 'pgpr_id', 'id');
    }

    // pgprs may be rejected by the QACDiretor
    public function qualityAssuranceCouncilDirectors(): BelongsTo
    {
        return $this->belongsTo(QualityAssuranceCouncilDirector::class, 'qac_dir_id', 'id');
    }

    //post graduate program review has many post graduate program review applications
    public function postGraduateProgramReviewApplications(): BelongsTo
    {
        return $this->belongsTo(PostGraduateProgramReviewApplication::class, 'pgpr_application_id', 'id');
    }

    public function reviewTeam(): HasOne
    {
        return $this->hasOne(ReviewTeam::class, 'pgpr_id')->latest();
    }

    public function hasAllReviewersAccepted() : bool {
        if($this -> acceptedReviewTeam){ //dean has accepted the team
            //need to check if all reviewers have accepted
            $reviewers = $this -> acceptedReviewTeam -> reviewers;

            foreach ($reviewers as $reviewer){
                if($reviewer -> pivot -> reviewer_confirmation != 'ACCEPTED'){
                    return false;
                }
            }

            return true;
        }

        return false;

    }
}
