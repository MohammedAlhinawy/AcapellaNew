<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ManagerCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $name;
    public string $email;
    public string $plainPassword;
    public string $choirName;

    public function __construct(string $name, string $email, string $plainPassword, string $choirName)
    {
        $this->name          = $name;
        $this->email         = $email;
        $this->plainPassword = $plainPassword;
        $this->choirName     = $choirName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Karibu Acapella — Akaunti yako ya Choir Manager',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.manager-credentials',
        );
    }
}
