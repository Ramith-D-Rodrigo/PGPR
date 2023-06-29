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
            $table -> unsignedBigInteger('vice_chancellor_id');
            $table -> unsignedBigInteger('dean_id');
            $table -> unsignedBigInteger('center_for_quality_assurance_director_id');
            $table->timestamps();

            //foreign keys
            $table -> foreign('post_graduate_program_review_id') -> references('id') -> on('post_graduate_program_review_applications');
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
