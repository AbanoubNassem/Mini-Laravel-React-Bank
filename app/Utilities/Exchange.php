<?php
/**
 * Created by Abanoub Nassem
 * Date: 7/24/18
 * Time: 12:28 PM
 */

namespace App\Utilities;


class Exchange
{
    /**
     * Base currency
     *
     * @var string
     */
    private $base;

    /**
     * Exchange rates
     *
     * @var array
     */
    private $data;

    /**
     * Exchange rate source (ECB or Yahoo)
     *
     * @var string
     */
    private $source;

    /**
     * 1) Download exchange rates from ECB or Yahoo
     * 2) Parse rates
     * 3) Change/Convert base currency (currency must be valid)
     *
     * @param  string $source
     *   Source for rates: 'ecb' or 'yahoo'
     * @param  string $base
     *   Base currency
     * @param  string $return
     *   Return type: 'json' returns json object
     * @return array|json
     *   Array or JSON object with rates
     */
    public function rates($source = 'yahoo', $base = 'USD', $return = 'json')
    {
        $this->source = strtolower($source);
        $this->base = strtoupper($base);

        // confirm rates were fetched correctly
        if ($this->fetch()) {
            // clean source & convert base currency
            $this->cleanSource();
            if ($this->convertBase()) {
                // return rates
                if (strtolower($return) === 'json') {
                    return json_encode($this->data);
                }
                return $this->data;
            }
            exit('Base currency does not exist in provided source');
        }
        exit('Error fetching source');
    }

    /**
     * Parse exchange rates from source response
     *
     * @return array
     *   Cleaned array of exchange rates
     */
    private function cleanSource()
    {
        $array = array();
        if ($this->source === 'ecb') {
            $array['base'] = 'EUR';
            foreach ($this->data->Cube->Cube->Cube as $rate) {
                $array['rates'][(string)$rate['currency']] = (float)$rate['rate'];
            }
            $array['rates']['EUR'] = (float)1.00;
        } else {
            $array['base'] = 'USD';
            foreach ($this->data->list->resources as $r) {
                foreach ($r->resource as $key => $val) {
                    // only scrape currencies

                    if (!isset($val->name)) continue;

                    if ($key === 'fields') {
                        if (stripos($val->name, '/') !== false) {
                            $currency = (string)substr($val->name, -3);
                            $array['rates'][$currency]['rate'] = (float)$val->price;
                            $array['rates'][$currency]['symbol'] = (string)substr($val->symbol, 0, strlen($val->symbol) - 2);
                        }
                    }
                }
            }
            $array['rates']['USD']['rate'] = (float)1.00;
            $array['rates']['USD']['symbol'] = '$';
        }
        // sort alphabetically
        ksort($array['rates']);
        $this->data = $array;
    }

    /**
     * Convert rates to use base currency
     *
     * @return boolean
     *   True on success
     */
    private function convertBase()
    {
        // check that defined base currency exists
        if (!isset($this->data['rates'][$this->base])) {
            return false;
        }

        // convert currencies
        if ($this->base !== $this->data['base']) {
            $rates = array();
            $base_rate = $this->data['rates'][$this->base];
            foreach ($this->data['rates'] as $key => $val) {
                if ($key !== $this->base) {
                    // round to 6 decimal places
                    $rates[$key] = (float)round($val * (1 / $base_rate), 6) ;
                } else {
                    if ($this->source === 'ecb') {
                        $rates['EUR'] = (float)round(1 / $base_rate, 6);
                    } else {
                        $rates['USD'] = (float)round(1 / $base_rate, 6);
                    }
                    $rates[$this->base] = (float)1.00;
                }
            }
            $this->data['base'] = $this->base;
            $this->data['rates'] = $rates;
        }
        return true;
    }

    /**
     * Download exchange rates from given source
     *
     * @return boolean
     *   True on success
     */
    private function fetch()
    {
        // ECB - updated daily between 2.15 p.m. and 3.00 p.m. CET
        if ($this->source === 'ecb') {
            $this->data = simplexml_load_file(
                'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
            );

            // check for valid XML
            if (@simplexml_load_string($this->data)) {
                return false;
            }
        } // Yahoo! Finance - Live exchange rates
        else {
            $this->data = file_get_contents(
                'http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/'
                . 'quote;currency=true?view=basic&format=json'
            );
            $this->data = json_decode($this->data);

            // check for valid JSON
            if (json_last_error()) {
                return false;
            }
        }
        return true;
    }
}