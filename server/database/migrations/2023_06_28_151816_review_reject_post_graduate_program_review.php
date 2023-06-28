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
        // pivot table for many-to-many reject relationship between the reviewers and pgprs
        Schema::create('reviewer_reject_post_graduate_program_review', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_graduate_program_review_id');
            $table->foreignId('reviewer_id');
            $table->string('comment')->default("");
            $table->timestamps();

            // indices
            $table->index('post_graduate_review_id');
            $table->index('reviewer_id');

            // foreign keys
            $table->foreign('post_graduate_review_id')->references('id')->on('post_graduate_review_programs')->onUpdate('cascade');
            $table->foreign('reviewer_id')->references('id')->on('reviewers')->onUpdate('cascade');
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
