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
            $table->foreignId('post_graduate_program_review_id');
            $table->foreignId('assign_by_chair_id');
            $table->foreignId('criteria_id');
            $table->timestamps();

            // indices
            $table->index('post_graduate_program_review_id');
            $table->index('assigned_by_chair_id');
            $table->index('criteria_id');

            // foreign keys
            $table->foreign('post_graduate_program_review_id')->references('id')->on('post_graduate_program_reviews')->onUpdate('cascade');
            $table->foreign('assigned_by_chair_id')->references('id')->on('reviewers')->onUpdate('cascade');
            $table->foreign('criteria_id')->references('id')->on('criterias')->onUpdate('cascade');
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
