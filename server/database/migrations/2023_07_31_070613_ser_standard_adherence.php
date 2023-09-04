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
        Schema::create('ser_standard_adherence', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ser_id');
            $table->unsignedBigInteger('standard_id');
            $table->longText('adherence');
            $table->timestamps();

            //foreign keys
            $table -> foreign('ser_id') -> references('id') -> on('self_evaluation_reports');
            $table -> foreign('standard_id') -> references('id') -> on('standards');

            //combination of ser_id and standard_id must be unique
            $table->unique(['ser_id', 'standard_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ser_standard_adherence');
    }
};
