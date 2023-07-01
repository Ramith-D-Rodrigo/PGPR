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
        Schema::create('academic_staff', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table -> string('designation');
            $table -> json('experience_in_industry');
            $table -> string('google_scholar_link');
            $table -> json('nominees'); //nominees from professional bodies (array of objects)
            $table -> json('department'); //department details of the academic staff (department name, department head name, head email, department postal address)
            $table -> json('experience_with_research_funds');
            $table -> integer('supervised_postgraduate_student_count');
            $table -> integer('publications_in_referred_journals_count');
            $table -> integer('abstract_count');
            $table -> integer('conference_preceedings_count');
            $table -> integer('book_chapters'); //book chapters count
            $table -> json('involvement_in_internal_quality_assurance');
            $table -> json('involment_in_study_programme_development');
            $table -> json('postgraduate_teaching_experience');
            $table -> json('postgraduate_qualifications'); //postgraduate qualifications (qualiifcation , slqf level of the qualification) [up to 4]
            $table -> json('prior_training_in_programme_review');

            $table -> string('cv'); //cv file path

            //foreign key
            $table -> foreign('id') -> references('id') -> on('university_sides');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_staff');
    }
};
