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
        Schema::create('programme_coordinators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->nullable();
            $table->foreignId('post_grad_program_id')->nullable();
            $table->date('assigned_date');
            $table->enum('current_status', ['ACTIVE', 'INACTIVE']); //active or inactive for being a coordinator
            $table->timestamps();

            // indices
            $table->index('faculty_id');
            $table->index('post_grad_program_id');

            //foreign keys
            $table -> foreign('id') -> references('id') -> on('academic_staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programme_coordinators');
    }
};
