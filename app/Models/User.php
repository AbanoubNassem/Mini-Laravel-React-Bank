<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'currency_id', 'account_id', 'balance'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'email',
    ];

    protected $with = ['currency'];

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function sentTransactions()
    {
        return $this->hasMany(Transaction::class , 'account_id', 'account_id');
    }

    public function receivedTransactions()
    {
        return $this->hasMany(Transaction::class, 'to_account_id' , 'account_id');
    }
}
