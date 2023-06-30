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
        Schema::create('self_evaluation_reports', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger('post_graduate_program_review_id');
            $table -> unsignedBigInteger('vice_chancellor_id') -> nullable(); //approved by vice chancellor
            $table -> unsignedBigInteger('dean_id') -> nullable();    //approved by dean
            $table -> unsignedBigInteger('center_for_quality_assurance_director_id') -> nullable();   //approved by center for quality assurance director
            $table->timestamps();

            //foreign keys
            $table -> foreign('post_graduate_program_review_id') -> references('id') -> on('post_graduate_program_review_applications');
            $table -> foreign('vice_chancellor_id') -> references('id') -> on('vice_chancellors');
            $table -> foreign('dean_id') -> references('id') -> on('deans');
            $table -> foreign('center_for_quality_assurance_director_id') -> references('id') -> on('center_for_quality_assurance_directors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('self_evaluation_reports');
    }
};
