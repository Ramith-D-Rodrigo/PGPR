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
        Schema::create('proper_evaluation_1s', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('pe_1_meeting_date');
            $table->date('end_date');
            $table->string('remark');
            $table->timestamps();

            $table->foreign('id')->references('id')->on('proper_evaluations');
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
