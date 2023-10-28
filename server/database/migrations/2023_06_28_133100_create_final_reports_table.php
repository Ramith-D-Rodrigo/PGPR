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
        Schema::create('final_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pgpr_id');
            $table->foreignId('review_team_id');
            $table->enum('type', ['PRELIMINARY', 'FINAL', 'SUBMITTED'])->default('PRELIMINARY');
            $table->string('preliminary_report')->nullable();
            $table->string('final_report')->nullable();
            $table->timestamps();

            // indices
            $table->index('pgpr_id');
            $table->index('review_team_id');

            // foreign keys
            $table->foreign('pgpr_id')->references('id')->on('post_graduate_program_reviews')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('review_team_id')->references('id')->on('review_teams')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('final_reports');
    }
};
