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
        Schema::create('post_graduate_program_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_graduate_program_id')->nullable();
            $table->foreignId('qac_dir_id')->nullable()->default(NULL);
            $table->enum('status_of_pgpr', ['PLANNING', 'SUBMITTED', 'DE', 'PE1', 'PE2', 'SUSPENDED', 'FINAL', 'COMPLETED'])->default('PLANNING');
            $table->string("payment_voucher") -> nullable(); // link of the voucher

            // $table->foreignId('final_report_id')->nullable()->default(NULL);
            // $table->foreignId('review_team_id')->nullable()->default(NULL);

            $table->foreignId('grouped_with')->nullable()->default(NULL);

            // added the string type for storing links
            $table->string("action_plan") -> nullable();

            $table->string("preliminary_report") -> nullable();

            // $table->foreignId('de_id')->nullable()->default(NULL);
            // $table->foreignId('pe_id')->nullable()->default(NULL);
            $table->timestamps();

            $table -> unsignedBigInteger('pgpr_application_id') -> nullable(); //appplication of the review

            // indices +> more indices are required
            $table->index('qac_dir_id');
            // $table->index('de_id');
            // $table->index('pe_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_graduate_program_reviews');
    }
};
