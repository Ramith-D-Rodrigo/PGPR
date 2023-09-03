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
        Schema::create('proper_evaluation_2s', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('site_visit_start_date')->nullable();
            $table->date('site_visit_end_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('remark')->default('None');
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
