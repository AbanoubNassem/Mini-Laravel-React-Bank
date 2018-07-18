<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', 'Auth\APIAuth@create');
Route::post('/login', 'Auth\APIAuth@login');
Route::post('/logout', function () {
    return response()->json();
});

Route::group(['middleware' => ['auth.token']], function () {
    Route::post('/refresh', function () {
        /*do nothing the TokenRefresh middleware will take care of it*/
    });
});


