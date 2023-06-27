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
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger('center_for_quality_assurance_id');
            $table -> unsignedBigInteger('quality_assurance_council_director_id'); //the director who added the university
            $table->timestamps();

            //foreign keys
            $table -> foreign('quality_assurance_council_director_id') -> references('id') -> on('quality_assurance_council_directors');
        });

        //university foreign key (alter univeristy_sides table)
        Schema::table('university_sides', function (Blueprint $table) {
            $table -> foreign('university_id') -> references('id') -> on('universities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
