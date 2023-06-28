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
        Schema::table('post_graduate_program_reviews', function (Blueprint $table) {
            // foreign keys
            $table->foreign('review_team_id')->references('id')->on('review_teams')->onUpdate('cascade');
            $table->foreign('post_graduate_program_id')->references('id')->on('post_graduate_programs')->onUpdate('cascade');
            $table->foreign('approved_by_qac_dir_id')->references('id')->on('quality_assurance_council_directors')->onUpdate('cascade');
            $table->foreign('rec_vice_chancellor_id')->references('id')->on('vice_chancellors')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('rec_iqau_director_id')->references('id')->on('internal_quality_assurance_unit_directors')->onUpdate('cascade');
            $table->foreign('rec_cqa_director_id')->references('id')->on('center_for_quality_assurance_directors')->onUpdate('cascade');
            $table->foreign('final_report_id')->references('id')->on('quality_assurance_council_directors');
            $table->foreign('de_id')->references('id')->on('desk_evaluations')->onUpdate('cascade');
            $table->foreign('pe_id')->references('id')->on('proper_evaluations')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('post_graduate_program_review', function (Blueprint $table) {
            //
        });
    }
};
