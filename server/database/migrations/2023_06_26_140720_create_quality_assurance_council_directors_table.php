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
        Schema::create('quality_assurance_council_directors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            //foreign key
            $table -> foreign('id') -> references('id') -> on('quality_assurance_council_officers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quality_assurance_council_directors');
    }
};
