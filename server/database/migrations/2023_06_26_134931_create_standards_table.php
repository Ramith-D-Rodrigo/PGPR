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
        Schema::create('standards', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger('criteria_id');
            $table->double("standard_no"); //cannot be unique due to change of description with same number in different slqf levels
            $table->longText("description");
            $table->json("valid_slqf_levels"); //if it has "all" then it is valid for all slqf levels, otherwise it is valid for the slqf levels specified
            $table->timestamps();

            //foreign key
            $table -> foreign('criteria_id') -> references('id') -> on('criterias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standards');
    }
};
