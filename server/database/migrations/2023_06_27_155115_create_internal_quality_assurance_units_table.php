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
        Schema::create('internal_quality_assurance_units', function (Blueprint $table) {
          $table->id();
          $table->string('address');
          $table->json('contact_no');
          $table->json('fax_no');
          $table->string('email')->unique()->nullable() -> default(null);
          $table->foreignId('faculty_id')->nullable();
          $table->foreignId('iqau_dir_id')->nullable()->default(NULL);
          $table->timestamps();

          // indices
          $table->index('faculty_id');

          // foreign keys
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::dropIfExists('internal_quality_assurance_units');
    }
};
