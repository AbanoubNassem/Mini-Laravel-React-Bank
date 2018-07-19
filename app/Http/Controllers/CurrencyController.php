<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurrencyController extends Controller
{
    public function update($id)
    {
        $currency = Currency::find($id);

        if (!$currency) return response()->json([], 404);

        \auth()->user()->update(['currency_id' => $id]);

        return response()->json([
            'message' => 'success',
            'data' => $currency
        ]);
    }
}
