<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ForexChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $currencies;

    /**
     * Create a new event instance.
     *
     * @param $currencies
     */
    public function __construct($currencies)
    {
        $this->currencies = $currencies;
//        foreach ($currencies['rates'] as $name => $currency) {
//            $this->currencies[] = [
//                'name' => $name,
//                'symbol' => $currency['symbol'],
//                'rate' => $currency['rate']
//            ];
//        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('forex');
    }
}
