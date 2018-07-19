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
    public function a_user_can_transfer_money_by_account_id()
    {
        //given we have a user and account id
        $user = \auth()->user();
        $to_user = factory('App\Models\User')->create();
        $amount = 500;

        $user_balance = $user->balance;
        $to_user_balance = $to_user->balance;

        // when transfer money

        $response = $this->post('/api/transfer/' . $to_user->account_id . '/' . $amount);

        //user have no enough balance
        $this->assertEquals($response->getStatusCode(), 402);

        $user->update([
            'balance' => 1000
        ]);

        $this->post('/api/transfer/' . $to_user->account_id . '/' . $amount);


        $user = $user->fresh();
        $to_user = $to_user->fresh();

        //current user balance - the sent amount
        $this->assertLessThanOrEqual($user->balance, $user_balance - $amount);

        //transferred to balance + the sent amount
        $this->assertGreaterThanOrEqual($to_user->balance, $to_user_balance + $amount);

    }


}
