<?php

namespace Database\Seeders;

use App\Models\QualityAssuranceCouncilOfficer;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //run criteria seeder
        $this->call([CriteriaSeeder::class]);

        //run standard seeder
        $this->call([StandardSeeder::class]);


        $officer = User::factory()->qac_officer()->production()->hasQualityAssuranceCouncilOfficer()->create();
        $director = QualityAssuranceCouncilOfficer::factory()->for(User::factory()->qac_director()->production())->hasQualityAssuranceCouncilDirector()->create();
    }
}
