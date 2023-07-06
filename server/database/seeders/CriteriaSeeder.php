<?php

namespace Database\Seeders;

use App\Models\Criteria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //7 criterias
        Criteria::factory()->criteria1()->create();
        Criteria::factory()->criteria2()->create();
        Criteria::factory()->criteria3()->create();
        Criteria::factory()->criteria4()->create();
        Criteria::factory()->criteria5()->create();
        Criteria::factory()->criteria6()->create();
        Criteria::factory()->criteria7()->create();

    }
}
