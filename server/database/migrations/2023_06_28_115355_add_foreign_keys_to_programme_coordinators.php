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
        Schema::table('programme_coordinators', function (Blueprint $table) {
            // foreign keys
            $table -> foreign('post_grad_program_id') -> references('id') -> on('post_graduate_programs')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programme_coordinators', function (Blueprint $table) {
            //
        });
    }
};
