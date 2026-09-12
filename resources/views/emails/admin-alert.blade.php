<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $notificationTitle }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            background-color: #f1f5f9;
            padding: 30px 15px;
        }
        .container {
            max-width: 620px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            padding: 36px 32px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 800;
            margin: 10px 0 0 0;
            letter-spacing: -0.5px;
        }
        .header .badge {
            display: inline-block;
            background: rgba(59, 130, 246, 0.25);
            border: 1px solid rgba(96, 165, 250, 0.45);
            color: #93c5fd;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            padding: 5px 14px;
            border-radius: 9999px;
        }
        .content {
            padding: 32px;
        }
        .intro-text {
            font-size: 14px;
            color: #475569;
            margin-bottom: 24px;
            line-height: 1.6;
        }
        .card {
            background-color: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin-bottom: 20px;
        }
        .card-header {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .spec-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .spec-grid td {
            padding: 7px 0;
            font-size: 13px;
            vertical-align: top;
        }
        .spec-label {
            color: #64748b;
            font-weight: 600;
            width: 38%;
        }
        .spec-value {
            color: #0f172a;
            font-weight: 700;
            width: 62%;
        }
        .spec-value a {
            color: #2563eb;
            text-decoration: none;
        }
        .spec-value a:hover {
            text-decoration: underline;
        }
        .btn-wrapper {
            text-align: center;
            margin: 28px 0 16px 0;
        }
        .btn-primary {
            display: inline-block;
            background: #2563eb;
            color: #ffffff !important;
            padding: 14px 28px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .reply-hint {
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            margin-top: 12px;
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 24px 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
        .footer p {
            margin: 4px 0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header Banner -->
            <div class="header">
                <span class="badge">{{ $badgeText }}</span>
                <h1>{{ $notificationTitle }}</h1>
            </div>

            <div class="content">
                <p class="intro-text">
                    {{ $notificationMessage }}
                </p>

                <!-- Information Details Card -->
                @if(!empty($details) && count($details) > 0)
                <div class="card">
                    <div class="card-header">Notification Details</div>
                    <table class="spec-grid">
                        @foreach($details as $label => $val)
                            @if(!empty($val))
                            <tr>
                                <td class="spec-label">{{ $label }}:</td>
                                <td class="spec-value">
                                    @if(filter_var($val, FILTER_VALIDATE_EMAIL))
                                        <a href="mailto:{{ $val }}">{{ $val }}</a>
                                    @elseif(preg_match('/^[+0-9\s()-]{7,}$/', $val))
                                        <a href="tel:{{ $val }}">{{ $val }}</a>
                                    @else
                                        {!! nl2br(e($val)) !!}
                                    @endif
                                </td>
                            </tr>
                            @endif
                        @endforeach
                    </table>
                </div>
                @endif

                <!-- Action Button -->
                @if(!empty($actionUrl))
                <div class="btn-wrapper">
                    <a href="{{ $actionUrl }}" class="btn-primary" target="_blank">
                        {{ $actionText }} &rarr;
                    </a>
                </div>
                @endif

                @if(!empty($replyToEmail))
                <div class="reply-hint">
                    &bull; Tip: You can reply directly to this email to contact {{ $replyToName ?: $replyToEmail }}.
                </div>
                @endif
            </div>

            <!-- Footer -->
            <div class="footer">
                <p><strong>Kampus Educational Consultancy</strong> &bull; Administrative Notification Center</p>
                <p>Dispatched automatically on {{ now()->format('M d, Y - h:i A') }}</p>
                <p>&copy; {{ date('Y') }} Kampus. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
