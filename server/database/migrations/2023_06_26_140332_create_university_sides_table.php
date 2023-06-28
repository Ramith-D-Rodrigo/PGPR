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
        Schema::create('university_sides', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('university_id') -> nullable();

            //foreign keys
            //user foreign key
            $table -> foreign('id') -> references('id') -> on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_sides');
    }
};