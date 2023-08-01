<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('review_teams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quality_assurance_council_officer_id')->nullable(); //qac officer who created the review team
            $table->foreignId('pgpr_id')->nullable();
            $table->unsignedBigInteger('dean_id')->nullable(); //dean who gives the consent
            $table->enum('status', ['PENDING', 'ACCEPTED', 'REJECTED'])->default('PENDING'); //in case the deans rejected the review team
            $table->string('dean_decision')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();

            // indices
            $table->index('pgpr_id');

            //foreign key
            $table->foreign('quality_assurance_council_officer_id')->references('id')->on('quality_assurance_council_officers');
            $table->foreign('dean_id')->references('id')->on('deans');
        });

        //create reviewer_review_teams pivot table
        Schema::create('reviewer_review_teams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reviewer_id');
            $table->unsignedBigInteger('review_team_id');
            $table->enum('role', ['CHAIR', 'MEMBER'])->default('MEMBER');
            $table->enum('reviewer_confirmation', ['ACCEPTED', 'REJECTED', 'PENDING'])->default('PENDING');
            $table->string('declaration_letter')->nullable();
            $table->timestamps();

            //foreign key
            $table->foreign('reviewer_id')->references('id')->on('reviewers');
            $table->foreign('review_team_id')->references('id')->on('review_teams');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_teams');
    }
};
