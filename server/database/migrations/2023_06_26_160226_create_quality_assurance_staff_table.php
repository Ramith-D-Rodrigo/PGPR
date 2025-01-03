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
        Schema::create('quality_assurance_staff', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('assigned_date');

            //foreign key
            $table -> foreign('id') -> references('id') -> on('university_sides');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quality_assurance_staff');
    }
};
