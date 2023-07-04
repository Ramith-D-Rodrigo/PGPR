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
        //
        Schema::create('ser_evidence_standard', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ser_id');
            $table->foreignId('standard_id');
            $table->foreignId('evidence_id');
            $table->string('adherence');
            $table->timestamps();

            $table->index('ser_id');
            $table->index('standard_id');
            $table->index('evidence_id');

            $table->foreign('ser_id')->references('id')->on('self_evaluation_reports')->onUpdate('cascade');
            $table->foreign('standard_id')->references('id')->on('standards')->onUpdate('cascade');
            $table->foreign('evidence_id')->references('id')->on('evidences')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
