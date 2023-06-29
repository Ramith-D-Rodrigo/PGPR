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
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iqau_id')->nullable()->default(NULL);
            $table->timestamps();

            // indices
            $table->index('iqau_id');

            //foreign key
            $table -> foreign('id') -> references('id') -> on('universities');
        });

        //alter table reviewer for foreign key
        Schema::table('reviewers', function (Blueprint $table) {
            $table->foreign('working_faculty')->references('id')->on('faculties');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};
