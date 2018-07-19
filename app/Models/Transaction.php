<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $with = ['from', 'to'];


    public function from()
    {
        return $this->belongsTo(User::class, 'account_id', 'account_id');
    }

    public function to()
    {
        return $this->belongsTo(User::class, 'to_account_id', 'account_id');
    }
}
