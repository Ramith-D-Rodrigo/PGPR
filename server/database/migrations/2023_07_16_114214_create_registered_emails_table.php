<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registered_emails', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
        });

        //create a trigger to insert new emails to registered_emails table

        //users table
        DB::unprepared('
            CREATE TRIGGER `users_after_insert` AFTER INSERT ON `users` FOR EACH ROW
            BEGIN
                INSERT INTO registered_emails (email) VALUES (NEW.official_email);
                INSERT INTO registered_emails (email) VALUES (NEW.personal_email);
            END'
        );

        //iqau table
        DB::unprepared('
            CREATE TRIGGER `internal_quality_assurance_units_after_insert` AFTER INSERT ON `internal_quality_assurance_units` FOR EACH ROW
            BEGIN
                IF NEW.email IS NOT NULL THEN
                    INSERT INTO registered_emails (email) VALUES (NEW.email);
                END IF;
            END'
        );

        //center for quality assurances table
        DB::unprepared('
            CREATE TRIGGER `center_for_quality_assurances_after_insert` AFTER INSERT ON `center_for_quality_assurances` FOR EACH ROW
            BEGIN
                IF NEW.email IS NOT NULL THEN
                    INSERT INTO registered_emails (email) VALUES (NEW.email);
                END IF;
            END'
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registered_emails');

        //drop triggers
        DB::unprepared('DROP TRIGGER IF EXISTS `users_after_insert`');
        DB::unprepared('DROP TRIGGER IF EXISTS `internal_quality_assurance_units_after_insert`');
        DB::unprepared('DROP TRIGGER IF EXISTS `center_for_quality_assurances_after_insert`');
    }
};
