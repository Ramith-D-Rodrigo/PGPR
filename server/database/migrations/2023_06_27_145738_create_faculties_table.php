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
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('dean_id');
            $table->string('website');
            $table->string('address');
            $table->foreignId('iqau_id')->nullable()->default(NULL);
            $table->foreignId('university_id');
            $table->timestamps();

            // indices
            $table->index('iqau_id');

            //foreign key
            $table -> foreign('university_id') -> references('id') -> on('universities');
            $table -> foreign('dean_id') -> references('id') -> on('deans');
        });

        //alter table reviewer for foreign key
        Schema::table('reviewers', function (Blueprint $table) {
            $table->foreign('working_faculty')->references('id')->on('faculties');
        });

        //alter table for faculty foreign key on deans table
        Schema::table('deans', function (Blueprint $table) {
            $table -> foreign('faculty_id') -> references('id') -> on('faculties');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};
