<?php

namespace App\Console\Commands;

use App\Events\ForexChanged;
use App\Models\Currency;
use App\Utilities\Exchange;
use Illuminate\Console\Command;

class ScrapeCurrencies extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:currencies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Re-fetch the new Currencies rates and store it in the db!';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('fetching new rates');
        $result = json_decode((new Exchange())->rates(), true);
        $cached = \Cache::get('exchange.rates');

        $this->info('comparing with cached value');
        // if the cached not equal to the current rates
        // that means rates changed and we need to update the database
        // and send the users the new rate via pusher

        if ($result !== $cached) {
            $this->info('saving new rates');

            \Cache::forever('exchange.rates', $result);

            Currency::truncate();
            $currencies = [];

            foreach ($result['rates'] as $currency => $value) {
                $currencies[] = [
                    'name' => $currency,
                    'symbol' => $value['symbol'],
                    'rate' => $value['rate']
                ];
            }

            Currency::insert($currencies);

//            dd(Currency::all(['id', 'name', 'symbol', 'rate'])->toArray());
            ForexChanged::dispatch(Currency::all(['id', 'name', 'symbol', 'rate'])->toArray());
            $this->info('finished saving new rates');
        } else {
            $this->info('the rates didn\'t change');
        }
    }


}
