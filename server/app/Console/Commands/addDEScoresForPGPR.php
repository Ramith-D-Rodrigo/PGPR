<?php

namespace App\Console\Commands;

use App\Models\Criteria;
use App\Models\PostGraduateProgramReview;
use App\Services\V1\PostGraduateProgramReviewService;
use App\Services\V1\StandardService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Nette\Utils\Random;
use Symfony\Component\Console\Input\InputArgument;

class addDEScoresForPGPR extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-de-scores-for-pgpr {pgpr_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pgpr_id = $this->argument('pgpr_id');
        $pgpr = PostGraduateProgramReview::find($pgpr_id);

        $criteria = Criteria::all();

        $pgp = $pgpr -> postGraduateProgram;

        $reviewTeam = $pgpr -> acceptedReviewTeam;

        foreach($reviewTeam -> reviewers as $reviewer) {
            $this -> setReviewerScore($reviewer, $pgpr, $pgp, $criteria);
        }


    }

    private function setReviewerScore($reviewer, $pgpr, $pgp, $criteria){
        foreach($criteria as $criterion) {
            $applicableStandards = StandardService::getApplicableStandards($pgp -> slqf_level, $pgp -> is_professional_pg_programme, $criterion -> id);

            foreach($applicableStandards as $standard) {
                $attributes = [
                    'desk_evaluation_id' => $pgpr -> deskEvaluations -> id,
                    'reviewer_id' => $reviewer -> id,
                    'standard_id' => $standard -> id,
                ];

                $score = rand(0, 3);

                if($score == 0 && rand(0, 10) % 3 != 0){
                    $score = rand(1, 3);
                }

                $values = [
                    'de_score' => $score,
                    'comment' => Str::random(15)
                ];

                DB::table('desk_evaluation_score')->updateOrInsert($attributes, $values);
            }
        }
    }



}
