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
            $table -> unsignedBigInteger('pgp_coordinator_id');
            $table -> unsignedBigInteger('vice_chancellor_id') -> nullable(); //approved by vice chancellor
            $table -> unsignedBigInteger('iqau_dir_id') -> nullable();    //approved by internal quality assurance unit director
            $table -> string('section_a') -> nullable(); //url of the section a
            $table -> string('section_b') -> nullable(); //url of the section b
            $table -> string('section_d') -> nullable(); //url of the section d
            $table -> string('final_ser_report') -> nullable(); //url of the final ser report
            $table -> unsignedBigInteger('center_for_quality_assurance_director_id') -> nullable();   //approved by center for quality assurance director
            $table->timestamps();

            //foreign keys
            $table -> foreign('post_graduate_program_review_id') -> references('id') -> on('post_graduate_program_review_applications');
            $table -> foreign('pgp_coordinator_id') -> references('id') -> on('programme_coordinators');
            $table -> foreign('vice_chancellor_id') -> references('id') -> on('vice_chancellors');
            $table -> foreign('center_for_quality_assurance_director_id', 'cqa_dir_id') -> references('id') -> on('center_for_quality_assurance_directors');
            $table -> foreign('iqau_dir_id') -> references('id') -> on('internal_quality_assurance_unit_directors');
        });

        Schema::create('ser_section_reviewer_remarks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ser_id')->nullable();
            $table->unsignedBigInteger('reviewer_id')->nullable();
            $table->enum('section', ['A', 'B', 'D']); //sections are A, B, and D
            $table->string('remark');
            $table->timestamps();

            $table->foreign('ser_id')->references('id')->on('self_evaluation_reports');
            $table->foreign('reviewer_id')->references('id')->on('reviewers');
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
