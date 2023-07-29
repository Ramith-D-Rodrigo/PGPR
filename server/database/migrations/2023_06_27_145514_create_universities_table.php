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
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->string('website');
            $table->json('contact_no');
            $table->json('fax_no');
            $table->unsignedBigInteger('center_for_quality_assurance_id');
            $table->unsignedBigInteger('quality_assurance_council_director_id')->nullable(); //the director who added the university (null for now due to testing)
            $table->unsignedBigInteger('vice_chancellor_id')->nullable(); //the vice chancellor of the university (null for now due to testing)
            $table->timestamps();

            //foreign keys
            $table->foreign('quality_assurance_council_director_id')->references('id')->on('quality_assurance_council_directors');
            $table->foreign('vice_chancellor_id')->references('id')->on('vice_chancellors');
        });

        //university foreign key (alter university_sides table)
        Schema::table('university_sides', function (Blueprint $table) {
            $table->foreign('university_id')->references('id')->on('universities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
