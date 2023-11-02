<?php

namespace App\Console\Commands;

use App\Models\Criteria;
use App\Models\Evidence;
use App\Models\SelfEvaluationReport;
use App\Services\V1\StandardService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class addEvidencesForSer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-evidences-for-ser {serId}';

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
        $serId = $this->argument('serId');

        $SER = SelfEvaluationReport::find($serId);

        $criteria = Criteria::all();

        foreach ($criteria as $criterion) {
            $this->addEvidences($SER, $criterion);
        }
    }

    protected $folderURLs = [
        'https://drive.google.com/drive/folders/1CelS3qxN6YR0AO5fUTs12JH09mZdH07U?usp=drive_link',
        'https://drive.google.com/drive/folders/1N4HbDIHrlDPdCdy9nZ4CoP5S_As9Zfa0?usp=drive_link',
        'https://drive.google.com/drive/folders/1pkZ1fW76JI-z9iOtx0Mn9shz2UebQYap?usp=drive_link'
    ];

    protected $fileURLs = [
        'https://docs.google.com/spreadsheets/d/1ji0f2zX70aNuMnBKXPdDayqXd_5gW-oKbyxgazgYixk/edit?pli=1#gid=0',
        'https://docs.google.com/document/d/1fwIjjyCERH7QVjkjMI6Bhpp7823bitwWOx8Y6TLg6Yw/edit?usp=drive_link',
        'https://docs.google.com/presentation/d/1lJZ5JQk3QgCFoAZzDdKsfjwTSub2KE4cI-FpjtLheA0/edit?usp=drive_link'
    ];


    private function addEvidences($SER, $criterion){
        $applicableStandards = StandardService::getApplicableStandards(
            $SER -> postGraduateProgramReview -> postGraduateProgram -> slqf_level,
            $SER -> postGraduateProgramReview -> postGraduateProgram -> is_professional_pg_programme,
            $criterion -> id);

        foreach($applicableStandards as $standard) {

            $amountOfEvidences = rand(1, 3);

            for($i = 0; $i < $amountOfEvidences; $i++){
                $applicableYears = [];

                for($j = 0; $j < 5; $j++){
                    if(rand(0, 10) % 3 == 0){
                        $applicableYears[] = $j + 1;
                    }
                }

                $evidence = [
                    'evidence_code' => $standard -> standard_no . '.' . ($i+1),
                    'evidence_name' => Str::random(8),
                    'applicable_years' => $applicableYears,
                    'self_evaluation_report_id' => $SER -> id,
                    'url' => rand(0, 10) % 2 == 0 ? $this -> folderURLs[rand(0, count($this -> folderURLs) - 1)] : $this -> fileURLs[rand(0, count($this -> fileURLs) - 1)],
                ];

                $createdEvidence = Evidence::create($evidence);

                $createdEvidence -> standards() -> attach($standard -> id, [
                    'ser_id' => $SER -> id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
