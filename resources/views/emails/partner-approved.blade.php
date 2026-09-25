@php
    $siteName = $siteName ?? \App\Models\Setting::get('site_name', config('app.name', 'Kampus Edu'));
    $footerName = $footerName ?? \App\Models\Setting::get('footer_name', $siteName);
@endphp
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner Application Approved</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            padding: 36px 32px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.5px;
        }

        .header .badge {
            display: inline-block;
            margin-top: 10px;
            background: rgba(147, 51, 234, 0.25);
            border: 1px solid rgba(168, 85, 247, 0.4);
            color: #d8b4fe;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 12px;
            border-radius: 9999px;
        }

        .content {
            padding: 32px;
        }

        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 16px;
        }

        .message {
            font-size: 14px;
            color: #475569;
            margin-bottom: 24px;
        }

        .credentials-card {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 28px;
        }

        .credentials-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            margin-bottom: 12px;
        }

        .cred-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .cred-label {
            color: #64748b;
            font-weight: 500;
        }

        .cred-value {
            color: #0f172a;
            font-weight: 700;
            font-family: monospace;
        }

        .button-wrapper {
            text-align: center;
            margin-bottom: 28px;
        }

        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            font-weight: 700;
            font-size: 14px;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }

        .security-notice {
            font-size: 12px;
            color: #64748b;
            margin-top: 20px;
            border-left: 3px solid #3b82f6;
            padding-left: 12px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>{{ $siteName }}</h1>
            <div class="badge">Official Partner Network</div>
        </div>
        <div class="content">
            <p class="greeting">Hello {{ $contactPerson }},</p>
            <p class="message">
                We are pleased to inform you that your agency partnership application for
                <strong>{{ $companyName }}</strong> has been officially <strong>approved</strong>!
            </p>
            <p class="message">
                You now have official access to the {{ $siteName }} Partner Portal where you can explore participating universities, admission guidelines, course repositories, and study abroad offerings.
            </p>

            <div class="credentials-card">
                <div class="credentials-title">Partner Account Details</div>
                <div class="cred-row">
                    <span class="cred-label">Agency / Institution:</span>
                    <span class="cred-value">{{ $companyName }}</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Contact Person:</span>
                    <span class="cred-value">{{ $contactPerson }}</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Registered Email:</span>
                    <span class="cred-value">{{ $email ?: 'To be confirmed on activation' }}</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Access Level:</span>
                    <span class="cred-value">Official Partner Portal</span>
                </div>
            </div>

            <div class="button-wrapper">
                <a href="{{ $magicLoginUrl }}" class="btn">Activate Account & Set Password</a>
            </div>

            <div class="security-notice">
                <p style="margin: 0 0 6px 0;">
                    <strong>Security Notice:</strong> To protect your agency account, login is only available via the
                    secure 1-click magic link above.
                </p>
                <p style="margin: 0;">
                    Upon clicking the button, you will be automatically signed in and asked to choose your permanent
                    password (and verify your email if required). This link is cryptographically signed and active for 7
                    days.
                </p>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ $footerName }}. All rights reserved. <br>
            If you did not request this account, please contact our support team.
        </div>
    </div>
</body>

</html>