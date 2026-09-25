@php
    $siteName = $siteName ?? \App\Models\Setting::get('site_name', config('app.name', 'RMS Consult'));
    $footerName = $footerName ?? \App\Models\Setting::get('footer_name', $siteName);
@endphp
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

                @php
                    $shortlistKey = null;
                    if (isset($details['Recommended Shortlist'])) {
                        $shortlistKey = 'Recommended Shortlist';
                    } elseif (isset($details['Shortlisted Courses'])) {
                        $shortlistKey = 'Shortlisted Courses';
                    }
                    $shortlistRaw = $shortlistKey ? $details[$shortlistKey] : null;

                    // Filter out shortlist entries from standard spec-grid
                    $generalDetails = is_array($details) ? array_filter($details, function($key) {
                        return !in_array($key, ['Recommended Shortlist', 'Shortlisted Courses', '_courses']);
                    }, ARRAY_FILTER_USE_KEY) : [];
                @endphp

                <!-- Information Details Card -->
                @if(!empty($generalDetails))
                    <div class="card">
                        <div class="card-header">Notification Details</div>
                        <table class="spec-grid">
                            @foreach($generalDetails as $label => $val)
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

                <!-- Recommended Courses Shortlist Table Card -->
                @if(!empty($shortlistRaw))
                    @php
                        $parsedCourses = [];
                        $hasVisibleTuition = false;

                        // 1. If dynamic collection is available in $details['_courses']
                        if (!empty($details['_courses']) && is_iterable($details['_courses'])) {
                            foreach ($details['_courses'] as $c) {
                                $cTitle = is_object($c) ? ($c->title ?? $c->name ?? '') : ($c['title'] ?? $c['name'] ?? '');
                                $uni = is_object($c) ? ($c->university->name ?? 'Partner Institution') : ($c['university']['name'] ?? 'Partner Institution');
                                $country = is_object($c) ? ($c->university->country->name ?? '') : ($c['university']['country']['name'] ?? '');
                                $showFee = is_object($c) ? ($c->show_tuition_fee ?? true) : ($c['show_tuition_fee'] ?? true);
                                $rawFee = is_object($c) ? ($c->tuition_fee ?? '') : ($c['tuition_fee'] ?? '');
                                $isVisible = (bool)$showFee && !empty($rawFee) && strtolower(trim($rawFee)) !== 'tuition on request' && strtolower(trim($rawFee)) !== 'varies';
                                if ($isVisible) {
                                    $hasVisibleTuition = true;
                                }
                                $parsedCourses[] = [
                                    'title' => $cTitle,
                                    'institution' => $country ? "{$uni}, {$country}" : $uni,
                                    'level' => is_object($c) ? ($c->level ?? '') : ($c['level'] ?? ''),
                                    'fee' => $isVisible ? $rawFee : null,
                                    'show_fee' => (bool)$showFee,
                                ];
                            }
                        } elseif (is_string($shortlistRaw)) {
                            $lines = array_filter(array_map('trim', explode("\n", $shortlistRaw)));
                            foreach ($lines as $line) {
                                $clean = preg_replace('/^\d+[\.\)]\s*/', '', $line);
                                $courseData = [
                                    'title' => $clean,
                                    'institution' => '',
                                    'level' => '',
                                    'fee' => '',
                                    'show_fee' => true,
                                ];
                                if (str_contains($clean, ' — ') || str_contains($clean, ' - ')) {
                                    $parts = preg_split('/\s*(?:—|-)\s*/u', $clean, 2);
                                    $courseData['title'] = trim($parts[0]);
                                    $rest = $parts[1] ?? '';
                                    $subparts = array_map('trim', explode('|', $rest));
                                    $courseData['institution'] = $subparts[0] ?? '';
                                    foreach (array_slice($subparts, 1) as $sp) {
                                        if (stripos($sp, 'level:') === 0) {
                                            $courseData['level'] = trim(substr($sp, 6));
                                        } elseif (stripos($sp, 'tuition:') === 0) {
                                            $courseData['fee'] = trim(substr($sp, 8));
                                        } elseif (empty($courseData['fee'])) {
                                            $courseData['fee'] = $sp;
                                        }
                                    }
                                } elseif (preg_match('/^(.*?)\s*\((.*?)\)(?:\s*\[(.*?)\])?(?:\s*\|\s*(.*?))?$/', $clean, $m)) {
                                    $courseData['title'] = trim($m[1]);
                                    $courseData['institution'] = trim($m[2]);
                                    $courseData['level'] = !empty($m[3]) ? trim($m[3]) : '';
                                    $courseData['fee'] = !empty($m[4]) ? trim($m[4]) : '';
                                }

                                // Check database to verify admin's show_tuition_fee setting
                                $dbCourse = \App\Models\Course::where('title', $courseData['title'])->first();
                                if ($dbCourse) {
                                    $courseData['show_fee'] = (bool)$dbCourse->show_tuition_fee;
                                    if (!$courseData['show_fee']) {
                                        $courseData['fee'] = '';
                                    }
                                }

                                if (!empty($courseData['fee']) && $courseData['show_fee'] && strtolower(trim($courseData['fee'])) !== 'tuition on request' && strtolower(trim($courseData['fee'])) !== 'varies') {
                                    $hasVisibleTuition = true;
                                }

                                $parsedCourses[] = $courseData;
                            }
                        }
                    @endphp

                    @if(!empty($parsedCourses))
                        <div class="card" style="padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; background-color: #ffffff;">
                            <div style="background-color: #f8fafc; padding: 12px 18px; border-bottom: 1px solid #e2e8f0;">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #475569;">
                                    Recommended Course Shortlist (AI Matcher)
                                </span>
                            </div>
                            <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                <thead>
                                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                                        <th style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: {{ $hasVisibleTuition ? '44%' : '55%' }};">Course &amp; Level</th>
                                        <th style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: {{ $hasVisibleTuition ? '32%' : '45%' }};">University &amp; Location</th>
                                        @if($hasVisibleTuition)
                                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: 24%;">Tuition Fee</th>
                                        @endif
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($parsedCourses as $pIdx => $pc)
                                        <tr style="background-color: {{ $pIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}; border-bottom: 1px solid #e2e8f0;">
                                            <td style="padding: 12px 14px; vertical-align: top;">
                                                <div style="font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.35;">
                                                    {{ $pc['title'] }}
                                                </div>
                                                @if(!empty($pc['level']))
                                                    <div style="margin-top: 4px;">
                                                        <span style="display: inline-block; background-color: #e0e7ff; color: #4338ca; font-weight: 600; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                            {{ $pc['level'] }}
                                                        </span>
                                                    </div>
                                                @endif
                                            </td>
                                            <td style="padding: 12px 14px; vertical-align: top;">
                                                <div style="font-size: 12px; font-weight: 600; color: #334155; line-height: 1.35;">
                                                    {{ $pc['institution'] ?: 'Partner Institution' }}
                                                </div>
                                            </td>
                                            @if($hasVisibleTuition)
                                                <td style="padding: 12px 14px; vertical-align: top;">
                                                    @if(!empty($pc['fee']) && ($pc['show_fee'] ?? true) && strtolower(trim($pc['fee'])) !== 'tuition on request')
                                                        <div style="font-size: 12px; font-weight: 700; color: #059669;">
                                                            {{ $pc['fee'] }}
                                                        </div>
                                                    @else
                                                        <div style="font-size: 12px; font-weight: normal; color: #64748b;">
                                                            Tuition on request
                                                        </div>
                                                    @endif
                                                </td>
                                            @endif
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
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
                <p><strong>{{ $siteName }}</strong> &bull; Administrative Notification Center</p>
                <p>Dispatched automatically on {{ now()->format('M d, Y - h:i A') }}</p>
                <p>&copy; {{ date('Y') }} {{ $footerName }}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>

</html>