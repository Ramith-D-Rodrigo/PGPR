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
          $table->foreignId('added_by_qac_dir_id');
          $table->foreignId('edited_by_qac_dir_id');
          $table->timestamps();

          // indices
          $table->index('faculty_id');
          $table->index('edited_by_qac_dir_id');
          $table->index('added_by_qac_dir_id');

          // foreign keys
          $table->foreign('faculty_id')->references('id')->on('faculties')->onUpdate('cascade')->onDelete('restrict');
          $table->foreign('added_by_qac_dir_id')->references('id')->on('quality_assurance_council_directors')->onUpdate('cascade')->onDelete('restrict');
          $table->foreign('edited_by_qac_dir_id')->references('id')->on('quality_assurance_council_directors')->onUpdate('cascade')->onDelete('restrict');
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
