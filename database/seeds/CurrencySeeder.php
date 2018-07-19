<?php

use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('currencies')->insert([
            'name' => 'USD',
            'symbol' => '$',
            'rate' => 1,
        ]);

        DB::table('currencies')->insert([
            'name' => 'AED',
            'symbol' => 'AED',
            'rate' => 3.8,
        ]);

        DB::table('currencies')->insert([
            'name' => 'EGP',
            'symbol' => 'EGP',
            'rate' => 17.80,
        ]);

        DB::Table('users')->update([
            'balance' => rand(500, 50000)
        ]);
    }
}
