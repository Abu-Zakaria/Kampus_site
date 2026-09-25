@php
    $siteName = $siteName ?? \App\Models\Setting::get('site_name', config('app.name', 'RMS Consult'));
    $footerName = $footerName ?? \App\Models\Setting::get('footer_name', $siteName);
@endphp
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
            max-width: 650px;
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

        .table-container {
            margin-bottom: 24px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .course-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
        }

        .course-table th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 12px 14px;
            border-bottom: 2px solid #cbd5e1;
        }

        .course-table td {
            padding: 14px 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .course-table tr:last-child td {
            border-bottom: none;
        }

        .level-pill {
            display: inline-block;
            background-color: #e0e7ff;
            color: #4338ca;
            font-weight: 600;
            font-size: 11px;
            padding: 2px 7px;
            border-radius: 4px;
            margin-right: 4px;
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
            <h1>{{ $siteName }}</h1>
            <div class="badge">AI Matcher Recommendations</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello {{ $name }},</div>

            <p class="message">
                Thank you for using our <strong>AI Course Matcher</strong>! Based on your target destination, level of
                study, and budget preferences, our admissions algorithm has curated the following personalized
                university shortlist for you:
            </p>

            <!-- Shortlisted Courses Table -->
            @php
                $normalizedCourses = [];
                if (is_string($courses)) {
                    $lines = array_filter(array_map('trim', explode("\n", $courses)));
                    foreach ($lines as $line) {
                        $clean = preg_replace('/^\d+[\.\)]\s*/', '', $line);
                        $item = [
                            'title' => $clean,
                            'university_name' => 'Partner Institution',
                            'country_name' => '',
                            'level' => 'Undergraduate / Postgraduate',
                            'duration' => null,
                            'tuition_fee' => 'Tuition on request',
                            'show_tuition_fee' => true,
                            'intake' => null,
                        ];
                        if (str_contains($clean, ' — ') || str_contains($clean, ' - ')) {
                            $parts = preg_split('/\s*(?:—|-)\s*/u', $clean, 2);
                            $item['title'] = trim($parts[0]);
                            $rest = $parts[1] ?? '';
                            $subparts = array_map('trim', explode('|', $rest));
                            $item['university_name'] = $subparts[0] ?? 'Partner Institution';
                            foreach (array_slice($subparts, 1) as $sp) {
                                if (stripos($sp, 'level:') === 0) {
                                    $item['level'] = trim(substr($sp, 6));
                                } elseif (stripos($sp, 'tuition:') === 0) {
                                    $item['tuition_fee'] = trim(substr($sp, 8));
                                } elseif ($item['tuition_fee'] === 'Tuition on request') {
                                    $item['tuition_fee'] = $sp;
                                }
                            }
                        } elseif (preg_match('/^(.*?)\s*\((.*?)\)(?:\s*\[(.*?)\])?(?:\s*\|\s*(.*?))?$/', $clean, $m)) {
                            $item['title'] = trim($m[1]);
                            $item['university_name'] = trim($m[2]);
                            if (!empty($m[3])) $item['level'] = trim($m[3]);
                            if (!empty($m[4])) $item['tuition_fee'] = trim($m[4]);
                        }

                        // Verify against database setting
                        $dbCourse = \App\Models\Course::where('title', $item['title'])->first();
                        if ($dbCourse) {
                            $item['show_tuition_fee'] = (bool)$dbCourse->show_tuition_fee;
                            if (!$item['show_tuition_fee']) {
                                $item['tuition_fee'] = 'Tuition on request';
                            }
                        }

                        $normalizedCourses[] = $item;
                    }
                } elseif (is_iterable($courses)) {
                    $normalizedCourses = $courses;
                }

                $hasAnyVisibleTuition = false;
                $hasAnyIntake = false;
                foreach ($normalizedCourses as $c) {
                    $showFee = is_object($c) ? ($c->show_tuition_fee ?? true) : ($c['show_tuition_fee'] ?? true);
                    $fee = is_object($c) ? ($c->tuition_fee ?? null) : ($c['tuition_fee'] ?? null);
                    $intake = is_object($c) ? ($c->intake ?? null) : ($c['intake'] ?? null);
                    if ($showFee && !empty($fee) && strtolower(trim($fee)) !== 'tuition on request' && strtolower(trim($fee)) !== 'varies') {
                        $hasAnyVisibleTuition = true;
                    }
                    if (!empty($intake)) {
                        $hasAnyIntake = true;
                    }
                }
                $showThirdColumn = $hasAnyVisibleTuition || $hasAnyIntake;
                $thirdColumnHeader = $hasAnyVisibleTuition ? 'Tuition & Intake' : 'Expected Intake';
            @endphp

            <div class="table-container" style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                <table class="course-table" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <thead>
                        <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                            <th style="padding: 12px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: {{ $showThirdColumn ? '44%' : '55%' }};">Course &amp; Level</th>
                            <th style="padding: 12px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: {{ $showThirdColumn ? '32%' : '45%' }};">University &amp; Country</th>
                            @if($showThirdColumn)
                                <th style="padding: 12px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: 24%;">{{ $thirdColumnHeader }}</th>
                            @endif
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($normalizedCourses as $index => $course)
                            @php
                                $cTitle = is_object($course) ? ($course->title ?? $course->name ?? '') : ($course['title'] ?? $course['name'] ?? '');
                                $uniName = is_object($course) ? ($course->university->name ?? 'Partner Institution') : ($course['university_name'] ?? ($course['university']['name'] ?? 'Partner Institution'));
                                $countryName = is_object($course) ? ($course->university->country->name ?? '') : ($course['country_name'] ?? ($course['university']['country']['name'] ?? ''));
                                $cLevel = is_object($course) ? ($course->level ?? 'Undergraduate / Postgraduate') : ($course['level'] ?? 'Undergraduate / Postgraduate');
                                $cDuration = is_object($course) ? ($course->duration ?? null) : ($course['duration'] ?? null);
                                $cTuition = is_object($course) ? ($course->tuition_fee ?? null) : ($course['tuition_fee'] ?? null);
                                $showTuition = is_object($course) ? ($course->show_tuition_fee ?? true) : ($course['show_tuition_fee'] ?? true);
                                $cIntake = is_object($course) ? ($course->intake ?? null) : ($course['intake'] ?? null);
                                $bgColor = ($index % 2 === 0) ? '#ffffff' : '#f8fafc';
                            @endphp
                            <tr style="background-color: {{ $bgColor }};">
                                <td style="padding: 14px 12px; vertical-align: top; border-bottom: 1px solid #e2e8f0;">
                                    <div style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.35; margin-bottom: 5px;">
                                        {{ $cTitle }}
                                    </div>
                                    <div style="font-size: 12px; color: #64748b;">
                                        <span class="level-pill" style="display: inline-block; background-color: #e0e7ff; color: #4338ca; font-weight: 600; font-size: 11px; padding: 2px 7px; border-radius: 4px; margin-right: 4px;">
                                            {{ $cLevel }}
                                        </span>
                                        @if(!empty($cDuration))
                                            <span>&bull; {{ $cDuration }}</span>
                                        @endif
                                    </div>
                                </td>
                                <td style="padding: 14px 12px; vertical-align: top; border-bottom: 1px solid #e2e8f0;">
                                    <div style="font-size: 13px; font-weight: 600; color: #1e293b;">
                                        {{ $uniName }}
                                    </div>
                                    @if(!empty($countryName))
                                        <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                                            📍 {{ $countryName }}
                                        </div>
                                    @endif
                                </td>
                                @if($showThirdColumn)
                                    <td style="padding: 14px 12px; vertical-align: top; border-bottom: 1px solid #e2e8f0;">
                                        @if($hasAnyVisibleTuition)
                                            <div style="font-size: 13px; font-weight: 700; color: #059669;">
                                                @if(!empty($cTuition) && $showTuition && strtolower(trim($cTuition)) !== 'tuition on request')
                                                    {{ $cTuition }}
                                                @else
                                                    <span style="color: #64748b; font-size: 12px; font-weight: normal;">Tuition on request</span>
                                                @endif
                                            </div>
                                        @endif
                                        @if(!empty($cIntake))
                                            <div style="font-size: 11px; color: #64748b; margin-top: {{ $hasAnyVisibleTuition ? '3px' : '0' }};">
                                                Intake: {{ $cIntake }}
                                            </div>
                                        @endif
                                    </td>
                                @endif
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Next Steps Guidance -->
            <div class="next-steps-card">
                <h4>What Happens Next?</h4>
                <p>
                    One of our certified education consultants will reach out to you within 24 hours to provide official
                    course syllabi, verify your scholarship eligibility, and guide you step-by-step through the
                    university application and student visa process.
                </p>
            </div>

            <p class="message" style="margin-bottom: 0;">
                Warm regards,<br>
                <strong>The {{ $siteName }} Global Admissions Team</strong><br>
                <span style="color: #64748b; font-size: 13px;">Connecting ambitious students to leading global
                    universities</span>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} {{ $footerName }}. All rights reserved.<br>
            If you have immediate questions, feel free to reply directly to this email or visit our <a
                href="{{ url('/') }}">Official Website</a>.
        </div>
    </div>
</body>

</html>