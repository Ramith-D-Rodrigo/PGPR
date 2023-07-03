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
            $table->json("contact_no");
            $table->json("fax_no");
            $table->foreignId('center_for_quality_assurance_director_id');

            //foreign keys
            $table -> foreign('id') -> references('id') -> on('quality_assurance_staff');
            $table -> foreign('center_for_quality_assurance_director_id', 'cqa_cqad') -> references('id') -> on('center_for_quality_assurance_directors');
        });

        //alter university table to add foreign key
        Schema::table('universities', function (Blueprint $table) {
            $table -> foreign('center_for_quality_assurance_id') -> references('id') -> on('center_for_quality_assurances');
        });

        //alter center for quality assurances director table for foreign key
        Schema::table('center_for_quality_assurance_directors', function (Blueprint $table) {
            $table -> foreign('center_for_quality_assurance_id', 'cqad_cqa') -> references('id') -> on('center_for_quality_assurances');
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
