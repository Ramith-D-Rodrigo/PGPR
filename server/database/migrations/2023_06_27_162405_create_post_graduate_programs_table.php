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
        Schema::create('post_graduate_programs', function (Blueprint $table) {
          $table->id();
          $table->foreignId('faculty_id');
          $table->foreignId('added_by_cqa_director_id');
          $table->foreignId('edited_by_cqa_director_id');
          $table->timestamps();

          // indices
          $table->index('faculty_id');
          $table->index('edited_by_cqa_director_id');
          $table->index('added_by_cqa_director_id');

          // foreign keys
          $table->foreign('faculty_id')->references('id')->on('faculties')->onUpdate('cascade')->onDelete('restrict');
          $table->foreign('added_by_cqa_director_id')->references('id')->on('center_for_quality_assurance_directors')->onUpdate('cascade')->onDelete('restrict');
          $table->foreign('edited_by_cqa_director_id')->references('id')->on('center_for_quality_assurance_directors')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::dropIfExists('post_graduate_programs');
    }
};
