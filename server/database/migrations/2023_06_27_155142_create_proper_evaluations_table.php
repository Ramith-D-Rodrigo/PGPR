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
        Schema::create('proper_evaluations', function (Blueprint $table) {
          $table->id();
          $table->foreignId('pgpr_id');
          $table->date('start_date');
          $table->date('end_date');
          $table->enum("stage", ['1', '2', 'COMPLETED']);
          $table->timestamps();

          // indices
          $table->index('pgpr_id');

          // foreign keys
          $table->foreign('pgpr_id')->references('id')->on('post_graduate_program_reviews')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proper_evaluations');
    }
};
