<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('deans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('assigned_date');
            $table->enum('current_status', ['ACTIVE', 'INACTIVE']); //active or inactive for being a dean
            $table->unsignedBigInteger('faculty_id')->nullable()->default(NULL);

            //foreign key
            $table->foreign('id')->references('id')->on('academic_staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deans');
    }
};
