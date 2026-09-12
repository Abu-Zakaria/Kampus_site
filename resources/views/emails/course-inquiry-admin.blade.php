<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Course Enquiry Received</title>
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
        .course-title {
            font-size: 17px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
        }
        .uni-name {
            font-size: 13px;
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 14px;
        }
        .spec-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .spec-grid td {
            padding: 6px 0;
            font-size: 13px;
        }
        .spec-label {
            color: #64748b;
            font-weight: 500;
            width: 40%;
        }
        .spec-value {
            color: #0f172a;
            font-weight: 700;
            width: 60%;
        }
        .student-row {
            margin-bottom: 10px;
            font-size: 13px;
        }
        .student-label {
            font-weight: 600;
            color: #64748b;
            display: inline-block;
            width: 110px;
        }
        .student-val {
            font-weight: 700;
            color: #0f172a;
        }
        .student-val a {
            color: #2563eb;
            text-decoration: none;
        }
        .student-val a:hover {
            text-decoration: underline;
        }
        .note-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            border-radius: 0 8px 8px 0;
            padding: 14px 16px;
            margin: 16px 0 24px 0;
            font-size: 13px;
            color: #1e3a8a;
            line-height: 1.6;
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
        .btn-secondary {
            display: inline-block;
            margin-top: 10px;
            color: #64748b;
            font-size: 12px;
            font-weight: 600;
            text-decoration: underline;
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
                <span class="badge">Academic Course Enquiry</span>
                <h1>New Student Inquiry Received</h1>
            </div>

            <div class="content">
                <p class="intro-text">
                    Hello Administrator, a prospective student has submitted an official course enquiry through the <strong>Courses Directory</strong> on the Kampus website.
                </p>

                <!-- Course Information Card -->
                <div class="card">
                    <div class="card-header">Target Programme & University</div>
                    <div class="course-title">{{ $details['course_title'] ?? $application?->course_title ?? 'Academic Course' }}</div>
                    <div class="uni-name">{{ $details['university_name'] ?? $application?->university_name ?? 'Partner Institution' }}</div>

                    <table class="spec-grid">
                        @if(!empty($details['level']) || !empty($application?->level))
                        <tr>
                            <td class="spec-label">Study Level:</td>
                            <td class="spec-value">{{ $details['level'] ?? $application->level }}</td>
                        </tr>
                        @endif

                        @if(!empty($details['duration']) || !empty($application?->duration))
                        <tr>
                            <td class="spec-label">Course Duration:</td>
                            <td class="spec-value">{{ $details['duration'] ?? $application->duration }}</td>
                        </tr>
                        @endif

                        @if(!empty($details['intake']) || !empty($application?->intake))
                        <tr>
                            <td class="spec-label">Intake Term:</td>
                            <td class="spec-value">{{ $details['intake'] ?? $application->intake }}</td>
                        </tr>
                        @endif

                        @if(!empty($details['tuition_fee']) || !empty($application?->tuition_fee))
                        <tr>
                            <td class="spec-label">Annual Tuition:</td>
                            <td class="spec-value">{{ $details['tuition_fee'] ?? $application->tuition_fee }}</td>
                        </tr>
                        @endif

                        @if(!empty($application?->application_no))
                        <tr>
                            <td class="spec-label">Application Ref:</td>
                            <td class="spec-value">{{ $application->application_no }}</td>
                        </tr>
                        @endif
                    </table>
                </div>

                <!-- Student Contact Card -->
                <div class="card">
                    <div class="card-header">Student Contact Information</div>
                    
                    <div class="student-row">
                        <span class="student-label">Applicant Name:</span>
                        <span class="student-val">{{ $inquiry->name }}</span>
                    </div>

                    <div class="student-row">
                        <span class="student-label">Email Address:</span>
                        <span class="student-val">
                            <a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a>
                        </span>
                    </div>

                    <div class="student-row">
                        <span class="student-label">Phone Number:</span>
                        <span class="student-val">
                            @if(!empty($inquiry->phone) && $inquiry->phone !== 'Not provided')
                                <a href="tel:{{ $inquiry->phone }}">{{ $inquiry->phone }}</a>
                            @else
                                <span style="color: #94a3b8;">Not provided</span>
                            @endif
                        </span>
                    </div>

                    <div class="student-row">
                        <span class="student-label">Received At:</span>
                        <span class="student-val">{{ now()->format('M d, Y - h:i A') }}</span>
                    </div>
                </div>

                <!-- Student Notes / Message -->
                @if(!empty($details['notes']))
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">Student's Questions / Notes</div>
                    <div class="note-box">
                        "{{ $details['notes'] }}"
                    </div>
                </div>
                @endif

                <!-- Call to Action Buttons -->
                <div class="btn-wrapper">
                    <a href="{{ $adminInquiriesUrl }}" class="btn-primary" target="_blank">
                        View & Reply in Admin Panel &rarr;
                    </a>
                    <br>
                    @if(!empty($adminApplicationsUrl))
                    <a href="{{ $adminApplicationsUrl }}" class="btn-secondary" target="_blank">
                        View Student Admission Applications
                    </a>
                    @endif
                </div>

                <div class="reply-hint">
                    &bull; Tip: You can also reply directly to this email notification to reach {{ $inquiry->name }} at {{ $inquiry->email }}.
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p><strong>Kampus Educational Consultancy</strong> &bull; Student Inquiries Dispatch</p>
                <p>This automated message was dispatched upon a course inquiry submitted from the /courses portal.</p>
                <p>&copy; {{ date('Y') }} Kampus. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
