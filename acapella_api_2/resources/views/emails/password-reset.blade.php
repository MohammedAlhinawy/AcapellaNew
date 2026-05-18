<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
    <style>
        /* Theme colors: --bg-primary:#0a0a0c | --bg-tertiary:#1a1a1d | --accent-primary:#667eea
           --success:#10b981 | --warning:#d97706 | --text-primary:#fff | --text-secondary:rgba(255,255,255,0.7) */
        body  { margin:0; padding:0; background:#0a0a0c; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
        .wrapper { height: 100%; width: 100%; background:#121214; overflow-x:hidden; overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.08); }

        /* Header */
        .header { background:#1a1a1d; padding:36px 40px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.06); }
        .header img  { height:72px; width:auto; display:block; margin:0 auto 14px; }
        .header h1   { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-size:1.6rem; margin:0; letter-spacing:1.5px; font-weight:700; }

        /* Body */
        .body { padding:36px 40px; color:rgba(255,255,255,0.85); }
        .body p { margin:0 0 16px; font-size:0.96rem; line-height:1.7; color:rgba(255,255,255,0.75); }
        .body strong { color:#ffffff; }

        /* CTA button */
        .btn-wrap { text-align:center; margin:30px 0 10px; }
        .btn { display:inline-block; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; text-decoration:none; padding:14px 40px; border-radius:12px; font-size:1rem; font-weight:600; letter-spacing:.3px; }

        /* URL fallback */
        .url-fallback { background:#1a1a1d; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px 16px; word-break:break-all; font-size:0.8rem; color:rgba(255,255,255,0.5); margin-top:8px; }

        /* Expiry note */
        .expiry-note { background:rgba(217,119,6,0.15); border-left:3px solid #d97706; border-radius:0 8px 8px 0; padding:11px 16px; font-size:0.85rem; color:#fbbf24; margin:20px 0; }

        /* Footer */
        .footer { background:#0a0a0c; padding:20px 40px; text-align:center; font-size:0.76rem; color:rgba(255,255,255,0.35); border-top:1px solid rgba(255,255,255,0.06); }
    </style>
</head>
<body>
    <div class="wrapper">

        <div class="header">
            <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="Acapella Logo" />
            <h1>Acapella</h1>
        </div>

        <div class="body">
            <p>Hi,</p>
            <p>We received a request to reset the password for the Acapella account associated with <strong>{{ $userEmail }}</strong>.</p>
            <p>Click the button below to set a new password.</p>

            <div class="expiry-note">
                ⏱ This reset link expires in <strong>60 minutes</strong>.
            </div>

            <div class="btn-wrap">
                <a href="{{ $resetUrl }}" class="btn">Reset Password</a>
            </div>

            <p style="margin-top:24px; font-size:0.85rem;">Or copy and paste this URL into your browser:</p>
            <div class="url-fallback">{{ $resetUrl }}</div>

            <p style="margin-top:24px; font-size:0.85rem;">If you did not request a password reset, you can safely ignore this email &mdash; your password will not be changed.</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Acapella &middot; Dar es Salaam, Tanzania<br />
            Check your spam folder if you didn&rsquo;t expect this email.
        </div>

    </div>
</body>
</html>
