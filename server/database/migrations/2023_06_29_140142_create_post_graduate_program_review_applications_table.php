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
        Schema::create('post_graduate_program_review_applications', function (Blueprint $table) {
            $table->id();
            $table->string('intent_letter')->nullable(); //path to the intent letter
            $table->date('request_date')->nullable(); //date of the request to submitted to CQADirector
            $table->date('application_date')->nullable(); //date of the application approved by CQADirector
            $table->unsignedBigInteger('dean_id')->nullable();
            $table->string("year_1");
            $table->string("year_2");
            $table->string("year_3");
            $table->string("year_4");
            $table->string("year_5");
            $table->date("y_end");
            $table->unsignedBigInteger('post_graduate_program_id')->nullable(); //id of the post graduate program that is being reviewed
            $table->unsignedBigInteger('quality_assurance_council_officer_id')->nullable(); //id of the quality assurance council officer who approved the application
            $table->timestamps();

            //foreign keys
            $table->foreign('dean_id')->references('id')->on('deans');
            $table->foreign('quality_assurance_council_officer_id', 'pgpra_qac_approval')->references('id')->on('quality_assurance_council_officers');
            $table->foreign('post_graduate_program_id', 'pgpra_pgp_foreign')->references('id')->on('post_graduate_programs');
        });

        //alter post graduate program review table to ad foreign key of application
        Schema::table('post_graduate_program_reviews', function (Blueprint $table) {
            $table->foreign('pgpr_application_id', 'pgpr_foreign')->references('id')->on('post_graduate_program_review_applications');
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
