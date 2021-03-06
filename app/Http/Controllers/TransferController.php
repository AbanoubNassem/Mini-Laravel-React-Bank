<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\NewTransaction;
use Illuminate\Http\Request;

class TransferController extends Controller
{
    public function transfer($to, $amount)
    {
        if (!($to = User::where('account_id', '=', $to)->first()))
            return response()->json([], 402);

        if ($to->id == auth()->user()->id)
            return response()->json(['message' => 'You can\'t transfer to yourself!'], 402);

        $amount = $amount / auth()->user()->currency->rate;

        if (auth()->user()->balance < $amount)
            return response()->json(['message' => 'Insufficient Balance'], 402);


        auth()->user()->update([
            'balance' => auth()->user()->balance - $amount
        ]);

        $to->update([
            'balance' => $to->balance + $amount
        ]);

        $transaction = Transaction::forceCreate([
            'account_id' => auth()->user()->account_id,
            'to_account_id' => $to->account_id,
            'amount' => $amount
        ]);

        $transaction->loadMissing(['to', 'from']);

        //notify the user
        $to->notify(new NewTransaction($transaction));

        //send the client real-time event
        NewNotification::dispatch($to);

        return response()->json([
            'message' => 'You have successfully transferred ' . $amount * auth()->user()->currency->rate . ' ' . auth()->user()->currency->symbol . ' to ' . $to->name,
        ]);
    }
}
