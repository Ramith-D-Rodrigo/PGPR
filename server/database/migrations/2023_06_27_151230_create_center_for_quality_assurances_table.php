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
        Schema::create('center_for_quality_assurances', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            //foreign keys
            $table -> foreign('id') -> references('id') -> on('quality_assurance_staff');
        });

        //alter university table to add foreign key
        Schema::table('universities', function (Blueprint $table) {
            $table -> foreign('center_for_quality_assurance_id') -> references('id') -> on('center_for_quality_assurances');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('center_for_quality_assurances');
    }
};
