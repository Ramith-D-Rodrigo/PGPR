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
            $table->integer("standard_no"); // since there are only 7 criteria and each standard is associated with a criteria
            $table->string("description");
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
