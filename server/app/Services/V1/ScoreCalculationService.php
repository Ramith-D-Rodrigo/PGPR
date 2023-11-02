<?php

namespace App\Services\V1;

use App\Models\PostGraduateProgramReview;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ScoreCalculationService
{
    public static function gradeObtainedByTheProgramOfStudy(string|int $pgprId, string $stage): array
    {
        $performanceScores = self::calculateOverallStudyProgramScores($pgprId, $stage);
        if (!$performanceScores || !$performanceScores['scores']) {
            return [];
        }

        $numberOfCriteriaLessThanMinimumCriterionScore = $performanceScores['numberOfCriteriaLessThanMinimumCriteriaScore'];
        $percentageOfActualCriterionWiseScores = $performanceScores['percentageOfActualCriterionWiseScores'];

        if ($numberOfCriteriaLessThanMinimumCriterionScore == 0) {
            if ($percentageOfActualCriterionWiseScores >= 80) {
                $performanceScores['overallPerformanceOfStudyScore'] = 'A';
            } else if (70 <= $percentageOfActualCriterionWiseScores && $percentageOfActualCriterionWiseScores <= 79) {
                $performanceScores['overallPerformanceOfStudyScore'] = 'B';
            } else if (60 <= $percentageOfActualCriterionWiseScores && $percentageOfActualCriterionWiseScores <= 69) {
                $performanceScores['overallPerformanceOfStudyScore'] = 'C';
            } else {
                $performanceScores['overallPerformanceOfStudyScore'] = 'D';
            }
        } else if ($numberOfCriteriaLessThanMinimumCriterionScore == 1) {
            if ($percentageOfActualCriterionWiseScores >= 70) {
                $performanceScores['overallPerformanceOfStudyScore'] = 'B';
            } else if (60 <= $percentageOfActualCriterionWiseScores && $percentageOfActualCriterionWiseScores <= 69) {
                $performanceScores['overallPerformanceOfStudyScore'] = 'C';
            } else {
                $performanceScores['overallPerformanceOfStudyScore'] = 'D';
            }
        } else if ($numberOfCriteriaLessThanMinimumCriterionScore == 2) {
            if ($percentageOfActualCriterionWiseScores >= 60) {
                $performanceScores['overallPerformanceOfStudyScore'] = 'C';
            } else {
                $performanceScores['overallPerformanceOfStudyScore'] = 'D';
            }
        } else {
            $performanceScores['overallPerformanceOfStudyScore'] = 'D';
        }

        return $performanceScores;
    }

    private static function calculateOverallStudyProgramScores(string|int $pgprId, string $stage): array
    {
        $criteriaScores = self::calculateCriterionWiseScores($pgprId, $stage);
        if (!$criteriaScores || !$criteriaScores['scores']) {
            return [];
        }

        $totalOfActualCriterionWiseScores = 0;
        $numberOfCriteriaLessThanMinimumCriterionScore = 0;

        foreach ($criteriaScores['scores'] as $criterionScore) {
            $totalOfActualCriterionWiseScores += $criterionScore['actualScore'];
            if ($criterionScore['isActualCriterionWiseScoreIsLessThanMinCriterionScore'])
                $numberOfCriteriaLessThanMinimumCriterionScore += 1;
        }

        $percentageOfActualCriterionWiseScores = $totalOfActualCriterionWiseScores / 10; //because the total score is out of 1000, and to get the percentage, we need to divide by 10 (score/1000 * 100 = score/10)
        $criteriaScores['percentageOfActualCriterionWiseScores'] = $percentageOfActualCriterionWiseScores;
        $criteriaScores['numberOfCriteriaLessThanMinimumCriteriaScore'] = $numberOfCriteriaLessThanMinimumCriterionScore;

        return $criteriaScores;
    }

    private static function calculateCriterionWiseScores(string|int $pgprId, string $stage): array
    {
        $postGraduateReviewProgram = PostGraduateProgramReview::find($pgprId);
        $pgp = $postGraduateReviewProgram->postGraduateProgram;
        $deskEvaluation = $postGraduateReviewProgram->deskEvaluations;

        // if there is no desk evaluation, then there cannot be a proper evaluation
        if (!$deskEvaluation) {
            return [];
        }

        $properEvaluation = $postGraduateReviewProgram->properEvaluations;
        $reviewerId = DB::table('reviewer_review_teams')
            ->select('reviewer_id')
            ->where('review_team_id', $postGraduateReviewProgram->reviewTeam->id)
            ->where('role', 'CHAIR')
            ->first() -> reviewer_id;

        $data = [];
        $data['scores'] = [];

        // Get all criteria
        $criteria = DB::table('criterias')->get();

        foreach ($criteria as $criterion) {
            // Get all standards for this criteria
            $standards = StandardService::getApplicableStandards(
                $pgp->slqf_level,
                $pgp->is_professional_pg_programme,
                $criterion->id
            );

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
                } else {
                    return [];
                }

                if (!$score) {
                    // If no score found for a standard, return values cannot be calculated
                    return [];
                }
                // add to the total
                $totalScore += $score->de_score ?? $score->pe_score;
                $score = NULL;
            }

            $maximumCriterionScore = count($standards) * 3;
            $minimumCriterionScore = $criterion->weightage_on_thousand / 2;
            $actualCriterionWiseScore = ($totalScore / $maximumCriterionScore) * $criterion->weightage_on_thousand;

            // Add to data
            $data['scores'][] = [
                'criteriaId' => $criterion->id,
                'criteriaName' => $criterion->name,
                'maximumCriterionScore' => $maximumCriterionScore,
                'minimumCriterionScore' => $minimumCriterionScore,
                'weightageOnThousand' => $criterion->weightage_on_thousand,
                'rawScore' => $totalScore,
                'actualScore' => $actualCriterionWiseScore,
                'isActualCriterionWiseScoreIsLessThanMinCriterionScore' => $actualCriterionWiseScore < $minimumCriterionScore,
            ];
        }
        return $data;
    }
}
