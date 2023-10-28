<?php

namespace App\Jobs\V1;

use App\Services\V1\PostGraduateProgramReviewService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SetPermissionsForPGPRFolder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $pgpr;
    protected $pgprFolder;

    public function __construct($pgpr, $pgprFolder)
    {
        $this -> pgpr = $pgpr;
        $this -> pgprFolder = $pgprFolder;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        PostGraduateProgramReviewService::SetPermissionsOfPGPRFolder($this -> pgprFolder, $this -> pgpr);
    }
}
