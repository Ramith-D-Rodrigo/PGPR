<?php

namespace Database\Seeders;

use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DevelopmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $officer = User::factory()->qac_officer()->hasQualityAssuranceCouncilOfficer()->create();
        $director = QualityAssuranceCouncilOfficer::factory()->for(User::factory()->qac_director())->hasQualityAssuranceCouncilDirector()->create();
    }
}
