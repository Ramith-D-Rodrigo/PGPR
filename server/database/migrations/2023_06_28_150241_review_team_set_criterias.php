<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // pivot table for the many-to-many set relationship between reviewers and assigning criteria
        Schema::create('review_team_set_criterias', function(Blueprint $table) {
            $table->id();
            $table->foreignId('pgpr_id');
            $table->foreignId('assigned_by_chair_id');
            $table->foreignId('criteria_id');
            $table->foreignID('assigned_to_reviewer_id');
            $table->foreignID('review_team_id');
            $table->timestamps();

            // indices
            $table->index('pgpr_id');
            $table->index('assigned_by_chair_id');
            $table->index('criteria_id');

            // foreign keys
            $table->foreign('pgpr_id')->references('id')->on('post_graduate_program_reviews')->onUpdate('cascade');
            $table->foreign('assigned_by_chair_id')->references('reviewer_id')->on('reviewer_review_teams')->onUpdate('cascade');
            $table->foreign('criteria_id')->references('id')->on('criterias')->onUpdate('cascade');
            $table->foreign('assigned_to_reviewer_id')->references('reviewer_id')->on('reviewer_review_teams')->onUpdate('cascade');
            $table->foreign('review_team_id')->references('review_team_id')->on('reviewer_review_teams')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
