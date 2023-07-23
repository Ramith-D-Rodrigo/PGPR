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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('initials');
            $table->string('surname');
            $table->json('roles')->nullable();
            $table->json('contact_no');
            $table->string('profile_pic') -> nullable();
            $table->string('official_telephone_no');
            $table->string('nic')->unique();
            $table->enum('gender', ['m', 'f']);
            $table->string('official_email')->unique();
            $table->string('personal_email')->unique();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
<<<<<<< HEAD
            $table->unsignedBigInteger('created_by')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending']);
=======
            $table->unsignedBigInteger('created_by')->nullable()->default(NULL);
            $table->integer('logins')->default(0);
            $table->enum('status', ['active', 'inactive']);
>>>>>>> master
            $table->rememberToken();
            $table->timestamps();

            //foreign key
            $table -> foreign('created_by') -> references('id') -> on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
