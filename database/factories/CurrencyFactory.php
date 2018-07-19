<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Currency::class, function (Faker $faker) {
    return [
        'name' => $faker->currencyCode,
        'symbol' => $faker->currencyCode,
        'rate' => $faker->randomFloat()
    ];
});
