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
        Schema::table('review_teams', function (Blueprint $table) {
            // foreign keys
            $table->foreign('pgpr_id')->references('id')->on('post_graduate_program_reviews')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('review_teams', function (Blueprint $table) {
            //
        });
    }
};
