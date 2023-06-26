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
        Schema::create('academic_staff', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            //foreign key
            $table -> foreign('id') -> references('id') -> on('quality_assurance_staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_staff');
    }
};
