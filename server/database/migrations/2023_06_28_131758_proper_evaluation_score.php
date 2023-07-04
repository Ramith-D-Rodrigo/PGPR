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
        // pivot table for the many-to-many relationship between the reviewers, proper evaluations, and standards
        Schema::create('proper_evaluation_score', function(Blueprint $table) {
            $table->id();
            $table->foreignId('proper_evaluation_id');
            $table->foreignId('reviewer_id');
            $table->foreignId('standard_id');
            $table->double('pe_score')->default(0.00);
            $table->string('comment');
            $table->timestamps();

            // indices
            $table->index('proper_evaluation_id');
            $table->index('reviewer_id');
            $table->index('standard_id');

            // foreign keys
            $table->foreign('proper_evaluation_id')->references('id')->on('proper_evaluations')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('reviewer_id')->references('id')->on('reviewers')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('standard_id')->references('id')->on('standards')->onUpdate('cascade')->onDelete('restrict');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desk_evaluation_score');
    }
};
