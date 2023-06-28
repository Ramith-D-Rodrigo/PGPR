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
        Schema::create('internal_quality_assurance_unit_directors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iqau_id');
            $table->timestamps();

            // indices
            $table->index('iqau_id');

            //foreign keys
            $table -> foreign('id') -> references('id') -> on('quality_assurance_staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internal_quality_assurance_unit_directors');
    }
};
