<?php

namespace App\Jobs\V1;

use App\Models\PostGraduateProgramReview;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\V1\PostGraduateProgramReviewService;

class CreatePGPRFolder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $pgpr;

    public function __construct(PostGraduateProgramReview $pgpr)
    {
        $this -> pgpr = $pgpr;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        return PostGraduateProgramReviewService::CreatePGPRFolder($this -> pgpr);
    }
}
