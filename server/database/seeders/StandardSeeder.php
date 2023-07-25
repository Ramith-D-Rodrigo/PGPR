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

        //filter the methods that have 'standard' in their name
        $standardFactoryMethods = array_filter($standardFactoryMethods, function ($method) {
            return strpos($method, 'standard') !== false;
        });


        foreach ($standardFactoryMethods as $method) {
            //call the method
            $standardFactory->$method()->create();
        }
    }
}
