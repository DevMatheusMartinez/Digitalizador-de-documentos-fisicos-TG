<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserPasswordMailable extends Mailable
{
    use Queueable, SerializesModels;

    private object $user;
    private string $password;

    public function __construct(object $user, string $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->user->email, $this->user->name);
        $this->subject('Master Revenda');

        return $this->view('mail.send-email-password', [
            'user' => $this->user,
            'password' => $this->password,
            'receive_password' => 'url',
        ]);
    }
}
