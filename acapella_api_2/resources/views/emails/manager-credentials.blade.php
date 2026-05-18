<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Karibu Acapella — Akaunti yako ya Choir Manager</title>
    <style>
        /* Theme: --bg-primary:#0a0a0c | --bg-secondary:#121214 | --bg-tertiary:#1a1a1d
           --accent-primary:#667eea | --accent-secondary:#764ba2
           --success:#10b981 | --success-bg:rgba(16,185,129,0.2) | --success-border:rgba(16,185,129,0.3)
           --warning:#d97706 | --warning-bg:rgba(217,119,6,0.2) | --warning-border:rgba(217,119,6,0.3)
           --text-primary:#fff | --text-secondary:rgba(255,255,255,0.7) | --border-primary:rgba(255,255,255,0.1) */
        body { margin:0; padding:0; background:#0a0a0c; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
        .wrapper { height: 100%; width: 100%; background:#121214; overflow-x:hidden; overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.08); }

        /* Header */
        .header { background:#1a1a1d; padding:36px 40px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.06); }
        .header img { height:72px; width:auto; display:block; margin:0 auto 14px; }
        .header h1 { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-size:1.6rem; margin:0; letter-spacing:1.5px; font-weight:700; }

        /* Approved badge */
        .badge-row { text-align:center; padding:28px 40px 0; }
        .badge { display:inline-block; background:rgba(16,185,129,0.15); color:#10b981; border:1.5px solid rgba(16,185,129,0.3); border-radius:9999px; padding:8px 24px; font-size:0.9rem; font-weight:600; }

        /* Body */
        .body { padding:28px 40px 36px; }
        .body p { margin:0 0 16px; font-size:0.96rem; line-height:1.7; color:rgba(255,255,255,0.75); }
        .body strong { color:#ffffff; }

        /* Credentials card */
        .creds-card { background:#1a1a1d; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:20px 24px; margin:24px 0; }
        .creds-title { font-size:0.74rem; font-weight:700; letter-spacing:.9px; text-transform:uppercase; color:#667eea; margin:0 0 16px; }
        .creds-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
        .creds-row:last-child { border-bottom:none; padding-bottom:0; }
        .creds-label { font-size:0.83rem; color:rgba(255,255,255,0.5); }
        .creds-value { font-size:0.93rem; font-weight:600; color:#ffffff; font-family:'Courier New',monospace; }

        /* CTA button */
        .btn-wrap { text-align:center; margin:28px 0 8px; }
        .btn { display:inline-block; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; text-decoration:none; padding:14px 40px; border-radius:12px; font-size:1rem; font-weight:600; letter-spacing:.3px; }

        /* Warning */
        .warning { background:rgba(217,119,6,0.15); border-left:3px solid #d97706; border-radius:0 8px 8px 0; padding:12px 16px; font-size:0.85rem; color:#fbbf24; margin-top:24px; line-height:1.6; }

        /* Footer */
        .footer { background:#0a0a0c; padding:20px 40px; text-align:center; font-size:0.76rem; color:rgba(255,255,255,0.35); border-top:1px solid rgba(255,255,255,0.06); }
        .footer a { color:#667eea; text-decoration:none; }
    </style>
</head>
<body>
    <div class="wrapper">

        {{-- Header --}}
        <div class="header">
            <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="Acapella Logo" />
            <h1>Acapella</h1>
        </div>

        {{-- Approved badge --}}
        <div class="badge-row">
            <span class="badge">✓ Ombi Limekubaliwa</span>
        </div>

        {{-- Body --}}
        <div class="body">
            <p>Habari <strong>{{ $name }}</strong>,</p>

            <p>
                Hongera! Ombi lako la kuwa <strong>Choir Manager</strong> kwa kwaya
                <strong>{{ $choirName }}</strong> limekubaliwa kwenye jukwaa la Acapella.
            </p>

            <p>Tumunda akaunti yako. Tumia maelezo yafuatayo kuingia:</p>

            {{-- Credentials card --}}
            <div class="creds-card">
                <div class="creds-title">Maelezo ya Kuingia</div>
                <div class="creds-row">
                    <span class="creds-label">Email</span>
                    <span class="creds-value">{{ $email }}</span>
                </div>
                <div class="creds-row">
                    <span class="creds-label">Nenosiri la muda</span>
                    <span class="creds-value">{{ $plainPassword }}</span>
                </div>
            </div>

            {{-- CTA --}}
            <div class="btn-wrap">
                <a href="{{ url('/login') }}" class="btn">Ingia sasa</a>
            </div>

            {{-- Warning --}}
            <div class="warning">
                <strong>⚠️ Muhimu:</strong> Tafadhali badilisha nenosiri lako mara tu baada ya kuingia kwa mara ya kwanza. Nenosiri hili ni la muda tu na halifai kushirikiwa na mtu mwingine.
            </div>

            <p style="margin-top:24px; font-size:0.85rem;">
                Ukipata tatizo lolote, wasiliana nasi kwa
                <a href="mailto:{{ config('mail.from.address') }}" style="color:#667eea;">{{ config('mail.from.address') }}</a>.
            </p>
        </div>

        {{-- Footer --}}
        <div class="footer">
            &copy; {{ date('Y') }} Acapella &middot; Dar es Salaam, Tanzania<br />
            Barua pepe hii imetumwa kwa sababu akaunti yako iliundwa. Ukifikiri ni kosa, wasiliana nasi mara moja.
        </div>

    </div>
</body>
</html>
