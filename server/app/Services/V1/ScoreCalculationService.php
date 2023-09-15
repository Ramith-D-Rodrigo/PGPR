<?php

namespace App\Services\V1;

use App\Models\PostGraduateProgramReview;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ScoreCalculationService
{
    public static function calculateRawCriterionWiseScore(string|int $pgprId, string $stage): array
    {
        $postGraduateReviewProgram = PostGraduateProgramReview::find($pgprId);
        $deskEvaluation = $postGraduateReviewProgram->deskEvaluation;

        // if there is no desk evaluation then there cannot be a proper evaluation
        if (!$deskEvaluation) {
            return [];
        }

        $properEvaluation = $postGraduateReviewProgram->properEvaluation;
        $reviewerId = Auth::id();
        $data = [];

        // Get all criteria
        $criteria = DB::table('criterias')->get();

        foreach ($criteria as $criterion) {
            // Get all standards for this criteria
            $standards = DB::table('standards')->where('criteria_id', $criterion->id)->get();

            $totalScore = 0;
            $score = NULL;
            foreach ($standards as $standard) {
                if ($stage == 'DE') {
                    // Get score from desk_evaluation_score table
                    $score = DB::table('desk_evaluation_score')
                        ->where('desk_evaluation_id', $deskEvaluation->id)
                        ->where('standard_id', $standard->id)
                        ->where('reviewer_id', $reviewerId)
                        ->first();
                } else if ($stage == 'PE') {
                    // Get score from proper_evaluation_score table
                    $score = DB::table('proper_evaluation_score')
                        ->where('proper_evaluation_id', $properEvaluation->id)
                        ->first();
                }

                if (!$score) {
                    // If no score found for a standard, return values cannot be calculated
                    return [];
                }
                // add to the total
                $totalScore += $score->de_score ?? $score->pe_score;
                $score = NULL;
            }

            // Add to data
            $data[] = [
                'criteria_id' => $criteria->id,
                'raw_score' => $totalScore,
            ];
        }
        return $data;
    }

    public static function calculateActualCriterionWiseScore(): array
    {
        // TODO: COMPLETE THE FUNCTION
        return [];
    }

    public static function calculateOverallStudyProgramScore()
    {
        // TODO: COMPLETE THE FUNCTION
    }

    public static function gradeObtainedByTheProgramOfStudy()
    {
        // TODO: COMPLETE THE FUNCTION
    }
}
