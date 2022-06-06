<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecoveryPassword extends Mailable
{
    use Queueable, SerializesModels;

    private object $user;

    public function __construct(object $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->user->email, $this->user->name);
        $this->subject('Código de verificação da Financeira');

        return $this->view('mail.recovery-password', [
            'user' => $this->user,
        ]);
    }
}
