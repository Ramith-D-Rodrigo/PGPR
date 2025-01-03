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
        Schema::create('vice_chancellors', function (Blueprint $table) {
            $table->id();
            $table->date("appointed_date");
            $table->foreignId('university_id')->nullable();
            $table->date("term_date"); // appointed_date + 5 year
            $table->enum("vc_status", ["ACTIVE", "INACTIVE"]);
            $table->timestamps();

            //foreign key
            $table -> foreign('id') -> references('id') -> on('university_sides');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vice_chancellors');
    }
};
