<?php

namespace App\Providers;

use App\Models\AcademicStaff;
use App\Models\CenterForQualityAssurance;
use App\Models\CenterForQualityAssuranceDirector;
use App\Models\Criteria;
use App\Models\Dean;
use App\Models\DeskEvaluation;
use App\Models\Evidence;
use App\Models\Faculty;
use App\Models\PostGraduateProgram;
use App\Models\PostGraduateProgramReviewApplication;
use App\Models\ProgrammeCoordinator;
use App\Models\ProperEvaluation;
use App\Models\QualityAssuranceCouncilDirector;
use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\QualityAssuranceStaff;
use App\Models\Reviewer;
use App\Models\ReviewTeam;
use App\Models\Standard;
use App\Models\University;
use App\Models\ViceChancellor;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
        //register all the policies here
        AcademicStaff::class => \App\Policies\AcademicStaffPolicy::class,
        CenterForQualityAssurance::class => \App\Policies\CenterForQualityAssurancePolicy::class,
        CenterForQualityAssuranceDirector::class => \App\Policies\CenterForQualityAssuranceDirectorPolicy::class,
        Criteria::class => \App\Policies\CriteriaPolicy::class,
        Dean::class => \App\Policies\DeanPolicy::class,
        DeskEvaluation::class => \App\Policies\DeskEvaluationPolicy::class,
        Evidence::class => \App\Policies\EvidencePolicy::class,
        Faculty::class => \App\Policies\FacultyPolicy::class,
        InternalQualityAssuranceUnit::class => \App\Policies\InternalQualityAssuranceUnitPolicy::class,
        InternalQualityAssuranceUnitDirector::class => \App\Policies\InternalQualityAssuranceUnitDirectorPolicy::class,
        PostGraduateProgram::class => \App\Policies\PostGraduateProgramPolicy::class,
        PostGraduateProgramReview::class => \App\Policies\PostGraduateProgramReviewPolicy::class,
        PostGraduateProgramReviewApplication::class => \App\Policies\PostGraduateProgramReviewApplicationPolicy::class,
        ProgrammeCoordinator::class => \App\Policies\ProgrammeCoordinatorPolicy::class,
        ProperEvaluation::class => \App\Policies\ProperEvaluationPolicy::class,
        QualityAssuranceCouncilOfficer::class => \App\Policies\QualityAssuranceCouncilOfficerPolicy::class,
        QualityAssuranceCouncilDirector::class => \App\Policies\QualityAssuranceCouncilDirectorPolicy::class,
        QualityAssuranceStaff::class => \App\Policies\QualityAssuranceStaffPolicy::class,
        Reviewer::class => \App\Policies\ReviewerPolicy::class,
        ReviewTeam::class => \App\Policies\ReviewTeamPolicy::class,
        SelfEvaluationReport::class => \App\Policies\SelfEvaluationReportPolicy::class,
        Standard::class => \App\Policies\StandardPolicy::class,
        UniversitySide::class => \App\Policies\UniversitySidePolicy::class,
        University::class => \App\Policies\UniversityPolicy::class,
        ViceChancellor::class => \App\Policies\ViceChancellorPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        //
    }
}
