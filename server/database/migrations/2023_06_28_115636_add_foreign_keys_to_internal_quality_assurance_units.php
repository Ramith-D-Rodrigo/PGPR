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
        Schema::table('internal_quality_assurance_units', function (Blueprint $table) {
            // foreign keys
            $table->foreign('faculty_id')->references('id')->on('faculties')->onUpdate('cascade');
            $table->foreign('iqau_dir_id')->references('id')->on('internal_quality_assurance_units')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internal_quality_assurance_units', function (Blueprint $table) {
            //
        });
    }
};
