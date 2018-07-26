<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NewTransaction extends Notification
{
    use Queueable;

    public $transaction;

    /**
     * Create a new notification instance.
     *
     * @param $transaction
     */
    public function __construct($transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $amount = round($this->transaction->amount * $this->transaction->from->currency->rate, 6);
        return [
            'message' => "{$this->transaction->from->name} has sent you {$amount}{$this->transaction->from->currency->name}!"
        ];
    }
}
