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
        Schema::create('post_graduate_program_review_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dean_id');
            $table->unsignedBigInteger('quality_assurance_council_officer_id');
            $table->timestamps();

            //foreign keys
            $table -> foreign('dean_id') -> references('id') -> on('deans');
            $table -> foreign('quality_assurance_council_officer_id', 'pgpra_qac_approval') -> references('id') -> on('quality_assurance_council_officers');
        });

        //create pivot table for review application and post graduate programs
        Schema::create('post_graduate_program_review_application_post_graduate_program', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger('post_graduate_program_review_application_id');
            $table -> unsignedBigInteger('post_graduate_program_id');
            $table->timestamps();

            //foreign key
            $table -> foreign('post_graduate_program_review_application_id', 'pgpra_foreign') -> references('id') -> on('post_graduate_program_review_applications');
            $table -> foreign('post_graduate_program_id', 'pgp_foreign') -> references('id') -> on('post_graduate_programs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_graduate_program_review_applications');
    }
};
