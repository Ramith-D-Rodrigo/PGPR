<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StandardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //get all functions of standard factory and call them using for loop
        $standardFactory = new \Database\Factories\StandardFactory();
        $standardFactoryMethods = get_class_methods($standardFactory);


        foreach ($standardFactoryMethods as $method) {
            //skip definition method
            if ($method == "definition") {
                continue;
            }

            //call the method
            $standardFactory->$method()->create();
        }
    }
}
