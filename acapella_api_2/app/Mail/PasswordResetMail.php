<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetUrl;
    public string $userEmail;

    public function __construct(string $resetUrl, string $userEmail)
    {
        $this->resetUrl  = $resetUrl;
        $this->userEmail = $userEmail;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Your Acapella Password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
        );
    }
}
