<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counselor Response to Your Inquiry</title>
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
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 32px;
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
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.35);
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            padding: 4px 12px;
            border-radius: 9999px;
        }
        .content {
            padding: 32px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .intro-text {
            font-size: 14px;
            color: #475569;
            margin-top: 0;
            margin-bottom: 24px;
            line-height: 1.6;
        }
        .reply-card {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #16a34a;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .reply-header {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #15803d;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .reply-body {
            font-size: 14px;
            color: #14532d;
            white-space: pre-line;
            line-height: 1.7;
            font-weight: 500;
        }
        .reply-signature {
            margin-top: 14px;
            padding-top: 10px;
            border-top: 1px solid #dcfce7;
            font-size: 12px;
            color: #166534;
            font-weight: 600;
        }
        .query-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 28px;
        }
        .query-header {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin-bottom: 6px;
        }
        .query-topic {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 6px;
        }
        .query-body {
            font-size: 13px;
            color: #475569;
            white-space: pre-line;
            line-height: 1.5;
        }
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: #ffffff !important;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }
        .footer {
            background: #f8fafc;
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
            <!-- Header -->
            <div class="header">
                <span class="badge">Official Counselor Response</span>
                <h1>Admissions Advisory Desk</h1>
            </div>

            <!-- Content Area -->
            <div class="content">
                <div class="greeting">Hello {{ $studentName }},</div>
                <p class="intro-text">
                    An educational advisor from <strong>Kampus</strong> has reviewed your inquiry and provided the following official response:
                </p>

                <!-- Counselor Reply -->
                <div class="reply-card">
                    <div class="reply-header">
                        <span>Counselor Response</span>
                    </div>
                    <div class="reply-body">{{ $replyMessage }}</div>
                    <div class="reply-signature">
                        Signed: {{ $counselorName }} &bull; {{ $repliedAt }}
                    </div>
                </div>

                <!-- Original Student Query -->
                <div class="query-card">
                    <div class="query-header">Regarding Your Original Inquiry:</div>
                    <div class="query-topic">{{ $topic }}</div>
                    <div class="query-body">{{ $originalMessage }}</div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin-top: 24px; margin-bottom: 12px;">
                    <a href="{{ $portalUrl }}" class="action-button">
                        View Query History &amp; Applications in Portal
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p><strong>Kampus Education Consultancy</strong></p>
                <p>This is an automated notification of your inquiry reply. You can track all your admissions and queries inside your student dashboard.</p>
            </div>
        </div>
    </div>
</body>
</html>
