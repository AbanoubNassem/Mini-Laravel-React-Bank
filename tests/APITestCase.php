<?php
/**
 * Created by PhpStorm.
 * User: abanoub
 * Date: 7/19/18
 * Time: 1:01 AM
 */

namespace Tests;

use App\Exceptions\Handler;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

class APITestCase extends TestCase
{

    protected function setUp()
    {
        parent::setUp();
        putenv('is_test=true');


        DB::statement('PRAGMA foreign_keys=on;');
//        $this->disableExceptionHandling();
    }
    protected function signIn($user = null)
    {
        $user = $user ?: factory('App\Models\User')->create();
        $this->actingAs($user);
        return $this;
    }

    protected function disableExceptionHandling()
    {
        $this->oldExceptionHandler = $this->app->make(ExceptionHandler::class);
        $this->app->instance(ExceptionHandler::class, new class extends Handler {
            public function __construct() {}
            public function report(\Exception $e) {}
            public function render($request, \Exception $e) {
                throw $e;
            }
        });
    }
    protected function withExceptionHandling()
    {
        $this->app->instance(ExceptionHandler::class, $this->oldExceptionHandler);
        return $this;
    }
}