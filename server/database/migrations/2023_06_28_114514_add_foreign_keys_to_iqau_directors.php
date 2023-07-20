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
        Schema::table('internal_quality_assurance_unit_directors', function (Blueprint $table) {
            // foreign key
            $table->foreign('iqau_id')->references('id')->on('internal_quality_assurance_units')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('iqau_director', function (Blueprint $table) {
            //
        });
    }
};
