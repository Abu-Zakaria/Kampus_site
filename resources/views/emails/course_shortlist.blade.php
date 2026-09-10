<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personalized University Shortlist</title>
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
            background: rgba(79, 70, 229, 0.25);
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: #c7d2fe;
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
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .message {
            font-size: 14px;
            color: #475569;
            margin-bottom: 24px;
            line-height: 1.6;
        }
        .course-card {
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 16px;
            transition: all 0.2s ease;
        }
        .course-title {
            margin: 0 0 6px 0;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
        }
        .course-meta {
            margin: 4px 0;
            font-size: 13px;
            color: #64748b;
        }
        .course-meta strong {
            color: #334155;
        }
        .tag-pill {
            display: inline-block;
            background: #e0e7ff;
            color: #4338ca;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 6px;
            margin-right: 6px;
            margin-top: 6px;
        }
        .next-steps-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 18px 20px;
            margin-top: 24px;
            margin-bottom: 24px;
        }
        .next-steps-card h4 {
            margin: 0 0 8px 0;
            color: #1e40af;
            font-size: 14px;
            font-weight: 700;
        }
        .next-steps-card p {
            margin: 0;
            color: #1e3a8a;
            font-size: 13px;
            line-height: 1.5;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        .footer a {
            color: #4f46e5;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Kampus EduConsult</h1>
            <div class="badge">AI Matcher Recommendations</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello {{ $name }},</div>
            
            <p class="message">
                Thank you for using our <strong>AI Course Matcher</strong>! Based on your target destination, level of study, and budget preferences, our admissions algorithm has curated the following personalized university shortlist for you:
            </p>

            <!-- Shortlisted Courses List -->
            @foreach($courses as $course)
            <div class="course-card">
                <h3 class="course-title">{{ $course->title ?? $course->name }}</h3>
                <p class="course-meta">
                    <strong>University:</strong> {{ $course->university->name ?? 'Partner Institution' }} 
                    @if(!empty($course->university->country->name))
                        ({{ $course->university->country->name }})
                    @endif
                </p>
                <p class="course-meta">
                    <strong>Level:</strong> {{ $course->level ?? 'Undergraduate / Postgraduate' }}
                    @if(!empty($course->duration))
                        &bull; <strong>Duration:</strong> {{ $course->duration }}
                    @endif
                </p>
                <p class="course-meta">
                    <strong>Tuition Fee:</strong> 
                    @if(!empty($course->tuition_fee) && ($course->show_tuition_fee ?? true))
                        {{ $course->tuition_fee }}
                    @else
                        Tuition on request / Scholarship eligible
                    @endif
                    @if(!empty($course->intake))
                        &bull; <strong>Next Intake:</strong> {{ $course->intake }}
                    @endif
                </p>
            </div>
            @endforeach

            <!-- Next Steps Guidance -->
            <div class="next-steps-card">
                <h4>What Happens Next?</h4>
                <p>
                    One of our certified education consultants will reach out to you within 24 hours to provide official course syllabi, verify your scholarship eligibility, and guide you step-by-step through the university application and student visa process.
                </p>
            </div>

            <p class="message" style="margin-bottom: 0;">
                Warm regards,<br>
                <strong>The Kampus Global Admissions Team</strong><br>
                <span style="color: #64748b; font-size: 13px;">Connecting ambitious students to leading global universities</span>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} Kampus Global Education. All rights reserved.<br>
            If you have immediate questions, feel free to reply directly to this email or visit our <a href="{{ url('/') }}">Official Website</a>.
        </div>
    </div>
</body>
</html>
