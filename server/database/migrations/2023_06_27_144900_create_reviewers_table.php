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
        Schema::create('reviewers', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger('working_faculty');
            $table -> enum('reviewer_status', ['pending', 'accepted', 'rejected', 'suspended']);
            $table->timestamps();

            //foreign key
            $table -> foreign('id') -> references('id') -> on('academic_staff');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviewers');
    }
};
