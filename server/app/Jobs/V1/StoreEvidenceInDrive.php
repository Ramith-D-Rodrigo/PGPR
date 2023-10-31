<?php

namespace App\Jobs\V1;

use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\PostGraduateProgramReview;
use App\Services\V1\PostGraduateProgramReviewService;
use App\Models\Evidence;


class StoreEvidenceInDrive implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    protected $evidence;
    protected $pgprFolder;

    /**
     * Create a new job instance.
     */
    public function __construct(Evidence $evidence, $pgprFolder)
    {
        $this -> evidence = $evidence;
        $this -> pgprFolder = $pgprFolder;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        PostGraduateProgramReviewService::StoreSingleEvidenceInSystemDrive($this -> evidence, $this -> pgprFolder);
    }
}
