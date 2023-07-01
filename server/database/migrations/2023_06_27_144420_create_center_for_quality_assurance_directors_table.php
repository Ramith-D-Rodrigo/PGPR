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
        Schema::create('center_for_quality_assurance_directors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table -> foreignId('center_for_quality_assurance_id');

            //foreign keys
            $table -> foreign('id') -> references('id') -> on('quality_assurance_staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('center_for_quality_assurance_directors');
    }
};
