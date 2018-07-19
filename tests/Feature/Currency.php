<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Auth;
use Tests\APITestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;


class Currency extends APITestCase
{
    use DatabaseMigrations;

    public function setUp()
    {
        parent::setUp();
        $this->signIn();
    }

    /** @test */
    public function a_user_can_retrieve_available_currencies()
    {
        factory('App\Models\Currency', 3)->create();

        //the user can retrieve the currency list from the api
        $currencies = $this->get('/api/currencies')->json();


        $this->assertArrayHasKey('name', $currencies[0]);
    }


    /** @test */
    public function a_user_can_know_the_balance_currency()
    {
        $currencies = factory('App\Models\Currency', 3)->create();

        $this->assertEquals(auth()->user()->currency->id, $currencies[0]->id);
    }

    /** @test */
    public function a_user_can_change_the_current_currency()
    {
        //be default it's the first one

        $currencies = factory('App\Models\Currency', 3)->create();

        $this->put('/api/currency/' . $currencies[1]->id)->json();

        $user = auth()->user()->refresh(); // get a refreshed instance from the database to compare it

        $this->assertNotEquals($user->currency->id, 1);
    }
}
