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


/**  for demo only  **/
Route::get('/transactions', function () {
    return response()->json(\App\Models\User::all());
});
/**----------------------------**/

Route::group(['middleware' => ['auth.token']], function () {
    Route::post('/refresh', function () {
        //maybe user got new transactions , refetch it
        return response()->json(auth()->user()->fresh());
    });

    Route::get('/currencies', function () {
        return \App\Models\Currency::all();
    });

    Route::put('/currency/{id}', 'CurrencyController@update');

    Route::post('/transfer/{to}/{amount}', 'TransferController@transfer');

    Route::get('/received-transaction',function(){
       return response()->json(auth()->user()->receivedTransactions);
    });

    Route::get('/sent-transaction',function(){
        return response()->json(auth()->user()->sentTransactions);
    });
});


