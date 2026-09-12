<?php

namespace App\Services;

use App\Models\Country;
use App\Models\University;
use App\Models\Course;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelService
{
    /**
     * Generate and download demo template for Countries.
     */
    public function generateCountriesSample(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Countries');

        $headers = [
            'name' => 'Country Name (Required)',
            'country_code' => 'Country Code (Optional, e.g. DE)',
            'subtitle' => 'Subtitle / Headline (Optional)',
            'image' => 'Cover Image (URL or paste image in cell)',
            'is_featured' => 'Is Featured? (Yes/No, Default: Yes)',
            'features' => 'Highlights (Semicolon-separated)',
            'slug' => 'Slug (Optional - auto generated if empty)',
        ];

        $sampleData = [
            [
                'Germany',
                'DE',
                'Tuition-Free Public Higher Education',
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800',
                'Yes',
                'No Tuition Fees; 18-Month Job Seeker Visa; Top EU Tech Hub; High Quality Education',
                'germany'
            ],
            [
                'Sweden',
                'SE',
                'World-Class Innovation & Sustainability',
                'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&q=80&w=800',
                'Yes',
                'Global Innovation Hub; Post-Study Work Visa; English-Taught Programs; High Living Standard',
                'sweden'
            ],
            [
                'Japan',
                'JP',
                'Cutting-Edge Technology & Safe Living',
                'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
                'Yes',
                'Safe & Modern Cities; Generous MEXT Scholarships; World-Leading Robotics; Rich Culture',
                'japan'
            ],
        ];

        $this->applyTemplateStyling($sheet, array_values($headers), $sampleData);

        return $this->streamDownload($spreadsheet, 'countries_demo_template.xlsx');
    }

    /**
     * Generate and download demo template for Universities.
     */
    public function generateUniversitiesSample(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Universities');

        $headers = [
            'name' => 'University Name (Required)',
            'country' => 'Country Name or Code (e.g. Germany or DE)',
            'location' => 'Location / Campus (Required)',
            'website' => 'Website URL (Optional)',
            'description' => 'Description (Optional)',
            'cover_image' => 'Cover Photo (URL or paste image in cell)',
            'logo' => 'Logo (URL or paste image in cell)',
            'features' => 'Key Features (Semicolon-separated)',
            'slug' => 'Slug (Optional - auto generated if empty)',
        ];

        $sampleData = [
            [
                'Technical University of Munich',
                'Germany',
                'Munich, Germany',
                'https://www.tum.de',
                'Technical University of Munich is one of Europe\'s top universities with excellence in research, engineering, and technology.',
                'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80',
                'QS World Rank #28; Excellence University; Top Engineering Faculty; High Employability',
                'technical-university-of-munich'
            ],
            [
                'University of Melbourne',
                'Australia',
                'Melbourne, Victoria, Australia',
                'https://www.unimelb.edu.au',
                'The University of Melbourne is a leading Australian public research university established in 1853.',
                'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
                'Ranked #1 in Australia; Group of Eight Member; Vibrant Campus Life; High Research Output',
                'university-of-melbourne'
            ],
            [
                'National University of Singapore',
                'Singapore',
                'Kent Ridge, Singapore',
                'https://www.nus.edu.sg',
                'NUS is Singapore\'s flagship university providing a global approach to education, research, and entrepreneurship.',
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                'Ranked #8 Globally; Asian Tech Hub; Comprehensive Financial Aid; Global Academic Partners',
                'national-university-of-singapore'
            ],
        ];

        $this->applyTemplateStyling($sheet, array_values($headers), $sampleData);

        return $this->streamDownload($spreadsheet, 'universities_demo_template.xlsx');
    }

    /**
     * Generate and download demo template for Courses.
     */
    public function generateCoursesSample(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Courses');

        $headers = [
            'title' => 'Course Title (Required)',
            'university' => 'University Name (Required, e.g. Technical University of Munich)',
            'level' => 'Degree Level (e.g. Postgraduate, Undergraduate, Foundation)',
            'duration' => 'Duration (Required, e.g. 2 Years, 1 Year Full-Time)',
            'tuition_fee' => 'Tuition Fee (Required, e.g. €1,500 / Semester or £18,500 / Year)',
            'show_tuition_fee' => 'Show Fee on Site? (Yes/No, Default: Yes)',
            'intake' => 'Intakes (Required, e.g. September, January)',
            'slug' => 'Slug (Optional - auto generated if empty)',
        ];

        $sampleData = [
            [
                'MSc Data Engineering and Analytics',
                'Technical University of Munich',
                'Postgraduate',
                '2 Years',
                '€1,500 / Semester',
                'Yes',
                'Winter (October), Summer (April)',
                'msc-data-engineering-and-analytics-tum'
            ],
            [
                'Bachelor of Computer Science',
                'University of Melbourne',
                'Undergraduate',
                '3 Years',
                'AUD $48,000 / Year',
                'Yes',
                'Semester 1 (February), Semester 2 (July)',
                'bachelor-of-computer-science-unimelb'
            ],
            [
                'Master of Science in Business Analytics',
                'National University of Singapore',
                'Postgraduate',
                '1 Year Full-Time',
                'SGD $58,000 / Course',
                'Yes',
                'August',
                'ms-business-analytics-nus'
            ],
        ];

        $this->applyTemplateStyling($sheet, array_values($headers), $sampleData);

        return $this->streamDownload($spreadsheet, 'courses_demo_template.xlsx');
    }

    /**
     * Import Countries from an uploaded Excel or CSV file.
     */
    public function importCountries(UploadedFile $file, bool $updateExisting = true): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $drawingsMap = $this->extractEmbeddedDrawings($sheet, 'countries');

        $rows = $sheet->toArray(null, true, true, true);
        if (empty($rows)) {
            return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => ['Uploaded file is empty.']];
        }

        $headerRow = null;
        $startRowIdx = 1;
        foreach ($rows as $rIdx => $rData) {
            if (!$this->isRowEmpty($rData)) {
                $headerRow = $rData;
                $startRowIdx = $rIdx;
                unset($rows[$rIdx]);
                break;
            }
        }

        if (!$headerRow) {
            return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => ['Uploaded file has no headers or data.']];
        }

        $colMap = $this->normalizeColumnMap($headerRow, 'countries');

        if (!isset($colMap['name'])) {
            return [
                'created' => 0,
                'updated' => 0,
                'skipped' => 0,
                'errors' => ["Missing required column 'name'. Please download and use the provided demo template."]
            ];
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        foreach ($rows as $rIdx => $row) {
            $rowIdx = $rIdx;
            if ($this->isRowEmpty($row)) {
                continue;
            }

            $name = trim((string)($row[$colMap['name']] ?? ''));
            if (empty($name)) {
                $errors[] = "Row {$rowIdx}: Country Name is required.";
                continue;
            }

            $slug = trim((string)($row[$colMap['slug'] ?? ''] ?? ''));
            if (empty($slug)) {
                $slug = Str::slug($name);
            }

            $countryCode = isset($colMap['country_code']) ? strtoupper(trim((string)$row[$colMap['country_code']])) : null;
            if ($countryCode && strlen($countryCode) > 10) {
                $countryCode = substr($countryCode, 0, 10);
            }

            $subtitle = isset($colMap['subtitle']) ? trim((string)$row[$colMap['subtitle']]) : null;

            // Handle image: check embedded drawing first, then cell text URL
            $imageColKey = $colMap['image'] ?? null;
            $coord = $imageColKey ? "{$imageColKey}{$rowIdx}" : null;
            $embeddedImage = $coord && isset($drawingsMap[$coord]) ? $drawingsMap[$coord] : null;
            $rawImageVal = $imageColKey ? trim((string)($row[$imageColKey] ?? '')) : null;
            $image = $this->resolveImageField($rawImageVal, $embeddedImage, 'countries');

            // Handle is_featured
            $isFeatured = true;
            if (isset($colMap['is_featured'])) {
                $rawFeatured = strtolower(trim((string)$row[$colMap['is_featured']]));
                if (in_array($rawFeatured, ['no', 'false', '0', 'off'])) {
                    $isFeatured = false;
                }
            }

            // Handle features
            $features = [];
            if (isset($colMap['features']) && !empty($row[$colMap['features']])) {
                $features = array_values(array_filter(array_map('trim', preg_split('/[;,]/', (string)$row[$colMap['features']]))));
            }

            $data = [
                'name' => $name,
                'slug' => $slug,
                'country_code' => $countryCode ?: null,
                'subtitle' => $subtitle ?: null,
                'is_featured' => $isFeatured,
                'features' => !empty($features) ? $features : null,
            ];

            if ($image) {
                $data['image'] = $image;
            }

            $existing = Country::where('slug', $slug)->orWhere('name', $name)->first();

            if ($existing) {
                if ($updateExisting) {
                    $existing->update(array_filter($data, fn($v) => !is_null($v)));
                    $updated++;
                } else {
                    $skipped++;
                }
            } else {
                Country::create($data);
                $created++;
            }
        }

        return [
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
        ];
    }

    /**
     * Import Universities from an uploaded Excel or CSV file.
     */
    public function importUniversities(UploadedFile $file, bool $updateExisting = true): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $drawingsMap = $this->extractEmbeddedDrawings($sheet, 'universities');

        $rows = $sheet->toArray(null, true, true, true);
        if (empty($rows)) {
            return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => ['Uploaded file is empty.']];
        }

        $headerRow = null;
        $startRowIdx = 1;
        foreach ($rows as $rIdx => $rData) {
            if (!$this->isRowEmpty($rData)) {
                $headerRow = $rData;
                $startRowIdx = $rIdx;
                unset($rows[$rIdx]);
                break;
            }
        }

        if (!$headerRow) {
            return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => ['Uploaded file has no headers or data.']];
        }

        $colMap = $this->normalizeColumnMap($headerRow, 'universities');

        if (!isset($colMap['name']) || !isset($colMap['location'])) {
            return [
                'created' => 0,
                'updated' => 0,
                'skipped' => 0,
                'errors' => ["Missing required columns ('name' and 'location'). Please download and use the provided demo template."]
            ];
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        foreach ($rows as $rIdx => $row) {
            $rowIdx = $rIdx;
            if ($this->isRowEmpty($row)) {
                continue;
            }

            $name = trim((string)($row[$colMap['name']] ?? ''));
            $location = trim((string)($row[$colMap['location']] ?? ''));

            if (empty($name)) {
                $errors[] = "Row {$rowIdx}: University Name is required.";
                continue;
            }
            if (empty($location)) {
                $errors[] = "Row {$rowIdx}: Campus Location is required.";
                continue;
            }

            $slug = trim((string)($row[$colMap['slug'] ?? ''] ?? ''));
            if (empty($slug)) {
                $slug = Str::slug($name);
            }

            // Resolve Country
            $countryId = null;
            if (isset($colMap['country']) && !empty($row[$colMap['country']])) {
                $countryRaw = trim((string)$row[$colMap['country']]);
                $country = Country::where('name', $countryRaw)
                    ->orWhere('slug', Str::slug($countryRaw))
                    ->orWhere('country_code', strtoupper($countryRaw))
                    ->first();

                if ($country) {
                    $countryId = $country->id;
                } else {
                    // Automatically create destination country if missing
                    $newCountry = Country::create([
                        'name' => $countryRaw,
                        'slug' => Str::slug($countryRaw),
                        'country_code' => strlen($countryRaw) <= 3 ? strtoupper($countryRaw) : null,
                    ]);
                    $countryId = $newCountry->id;
                }
            }

            $website = isset($colMap['website']) ? trim((string)$row[$colMap['website']]) : null;
            $description = isset($colMap['description']) ? trim((string)$row[$colMap['description']]) : null;

            // Handle cover_image
            $coverColKey = $colMap['cover_image'] ?? null;
            $coverCoord = $coverColKey ? "{$coverColKey}{$rowIdx}" : null;
            $embeddedCover = $coverCoord && isset($drawingsMap[$coverCoord]) ? $drawingsMap[$coverCoord] : null;
            $rawCoverVal = $coverColKey ? trim((string)($row[$coverColKey] ?? '')) : null;
            $coverImage = $this->resolveImageField($rawCoverVal, $embeddedCover, 'universities/covers');

            // Handle logo
            $logoColKey = $colMap['logo'] ?? null;
            $logoCoord = $logoColKey ? "{$logoColKey}{$rowIdx}" : null;
            $embeddedLogo = $logoCoord && isset($drawingsMap[$logoCoord]) ? $drawingsMap[$logoCoord] : null;
            $rawLogoVal = $logoColKey ? trim((string)($row[$logoColKey] ?? '')) : null;
            $logo = $this->resolveImageField($rawLogoVal, $embeddedLogo, 'universities/logos');

            // Handle features
            $features = [];
            if (isset($colMap['features']) && !empty($row[$colMap['features']])) {
                $features = array_values(array_filter(array_map('trim', preg_split('/[;,]/', (string)$row[$colMap['features']]))));
            }

            $data = [
                'country_id' => $countryId,
                'name' => $name,
                'slug' => $slug,
                'location' => $location,
                'website' => $website ?: null,
                'description' => $description ?: null,
                'features' => !empty($features) ? $features : null,
            ];

            if ($coverImage) {
                $data['cover_image'] = $coverImage;
            }
            if ($logo) {
                $data['logo'] = $logo;
            }

            $existing = University::where('slug', $slug)->orWhere('name', $name)->first();

            if ($existing) {
                if ($updateExisting) {
                    $existing->update(array_filter($data, fn($v) => !is_null($v)));
                    $updated++;
                } else {
                    $skipped++;
                }
            } else {
                University::create($data);
                $created++;
            }
        }

        return [
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
        ];
    }

    /**
     * Import Courses from an uploaded Excel or CSV file.
     */
    public function importCourses(UploadedFile $file, bool $updateExisting = true): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();

        $rows = $sheet->toArray(null, true, true, true);
        if (empty($rows)) {
            return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => ['Uploaded file is empty.']];
        }

        $headerRow = null;
        $startRowIdx = 1;
        foreach ($rows as $rIdx => $rData) {
            if (!$this->isRowEmpty($rData)) {
                $headerRow = $rData;
                $startRowIdx = $rIdx;
                unset($rows[$rIdx]);
                break;
            }
        }

        if (!$headerRow) {
            return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => ['Uploaded file has no headers or data.']];
        }

        $colMap = $this->normalizeColumnMap($headerRow, 'courses');

        if (!isset($colMap['title']) || !isset($colMap['university'])) {
            return [
                'created' => 0,
                'updated' => 0,
                'skipped' => 0,
                'errors' => ["Missing required columns ('title' and 'university'). Please download and use the provided demo template."]
            ];
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        foreach ($rows as $rIdx => $row) {
            $rowIdx = $rIdx;
            if ($this->isRowEmpty($row)) {
                continue;
            }

            $title = trim((string)($row[$colMap['title']] ?? ''));
            $uniName = trim((string)($row[$colMap['university']] ?? ''));

            if (empty($title)) {
                $errors[] = "Row {$rowIdx}: Course Title is required.";
                continue;
            }
            if (empty($uniName)) {
                $errors[] = "Row {$rowIdx}: University Name is required.";
                continue;
            }

            // Find university
            $university = University::where('name', $uniName)
                ->orWhere('slug', Str::slug($uniName))
                ->first();

            if (!$university) {
                $errors[] = "Row {$rowIdx}: University '{$uniName}' was not found in the database. Please create the university first or verify the exact name.";
                continue;
            }

            $level = isset($colMap['level']) ? trim((string)$row[$colMap['level']]) : 'Undergraduate';
            $duration = isset($colMap['duration']) ? trim((string)$row[$colMap['duration']]) : '3 Years';
            $tuitionFee = isset($colMap['tuition_fee']) ? trim((string)$row[$colMap['tuition_fee']]) : 'Contact for Fees';
            $intake = isset($colMap['intake']) ? trim((string)$row[$colMap['intake']]) : 'September';

            $showTuitionFee = true;
            if (isset($colMap['show_tuition_fee'])) {
                $rawShowFee = strtolower(trim((string)$row[$colMap['show_tuition_fee']]));
                if (in_array($rawShowFee, ['no', 'false', '0', 'off', 'hide'])) {
                    $showTuitionFee = false;
                }
            }

            $slug = trim((string)($row[$colMap['slug'] ?? ''] ?? ''));
            if (empty($slug)) {
                $slug = Str::slug($title . '-' . $university->slug);
            }

            $data = [
                'university_id' => $university->id,
                'title' => $title,
                'slug' => $slug,
                'level' => $level ?: 'Undergraduate',
                'duration' => $duration ?: '3 Years',
                'tuition_fee' => $tuitionFee ?: 'Contact for Fees',
                'show_tuition_fee' => $showTuitionFee,
                'intake' => $intake ?: 'September',
            ];

            $existing = Course::where('slug', $slug)
                ->orWhere(function ($q) use ($university, $title) {
                    $q->where('university_id', $university->id)->where('title', $title);
                })
                ->first();

            if ($existing) {
                if ($updateExisting) {
                    $existing->update($data);
                    $updated++;
                } else {
                    $skipped++;
                }
            } else {
                Course::create($data);
                $created++;
            }
        }

        return [
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
        ];
    }

    /**
     * Extract embedded drawings / pictures from an active worksheet and save to public storage.
     * Returns a map of [CellCoordinate => publicStoragePath], e.g. ['D2' => '/storage/countries/abc.png'].
     */
    protected function extractEmbeddedDrawings(Worksheet $sheet, string $subfolder): array
    {
        $drawingsMap = [];

        try {
            foreach ($sheet->getDrawingCollection() as $drawing) {
                $coordinates = $drawing->getCoordinates(); // e.g. 'D2'
                if (empty($coordinates)) {
                    continue;
                }

                $filename = Str::random(24);
                $extension = 'png';
                $imageData = null;

                if ($drawing instanceof Drawing) {
                    $path = $drawing->getPath();
                    if (file_exists($path)) {
                        $imageData = file_get_contents($path);
                        $ext = pathinfo($path, PATHINFO_EXTENSION);
                        if ($ext) {
                            $extension = strtolower($ext);
                        }
                    }
                } elseif ($drawing instanceof MemoryDrawing) {
                    ob_start();
                    call_user_func(
                        $drawing->getRenderingFunction(),
                        $drawing->getImageResource()
                    );
                    $imageData = ob_get_contents();
                    ob_end_clean();

                    switch ($drawing->getMimeType()) {
                        case MemoryDrawing::MIMETYPE_PNG:
                            $extension = 'png';
                            break;
                        case MemoryDrawing::MIMETYPE_JPEG:
                            $extension = 'jpg';
                            break;
                        case MemoryDrawing::MIMETYPE_GIF:
                            $extension = 'gif';
                            break;
                    }
                }

                if ($imageData) {
                    $storagePath = "{$subfolder}/{$filename}.{$extension}";
                    Storage::disk('public')->put($storagePath, $imageData);
                    $drawingsMap[$coordinates] = "/storage/{$storagePath}";
                }
            }
        } catch (\Throwable $e) {
            // Log drawing extraction error safely without terminating import
            report($e);
        }

        return $drawingsMap;
    }

    /**
     * Resolve image field value:
     * 1. If an embedded drawing exists at the cell coordinate, prioritize it.
     * 2. If a web URL is supplied, download and store it locally so it's permanently preserved.
     * 3. Fallback to existing path or null.
     */
    protected function resolveImageField(?string $cellVal, ?string $embeddedPath, string $subfolder): ?string
    {
        if ($embeddedPath) {
            return $embeddedPath;
        }

        if (empty($cellVal)) {
            return null;
        }

        // If it's an external HTTP/HTTPS URL, download and save locally
        if (preg_match('/^https?:\/\//i', $cellVal)) {
            try {
                $response = Http::timeout(6)->get($cellVal);
                if ($response->successful() && !empty($response->body())) {
                    $contentType = $response->header('Content-Type');
                    $ext = 'jpg';
                    if (str_contains($contentType, 'png')) {
                        $ext = 'png';
                    } elseif (str_contains($contentType, 'webp')) {
                        $ext = 'webp';
                    } elseif (str_contains($contentType, 'svg')) {
                        $ext = 'svg';
                    } elseif (str_contains($contentType, 'gif')) {
                        $ext = 'gif';
                    } else {
                        // Extract extension from URL if available
                        $urlExt = pathinfo(parse_url($cellVal, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION);
                        if (in_array(strtolower($urlExt), ['jpg', 'jpeg', 'png', 'webp', 'svg'])) {
                            $ext = strtolower($urlExt);
                        }
                    }

                    $filename = Str::random(24) . '.' . $ext;
                    $storagePath = "{$subfolder}/{$filename}";
                    Storage::disk('public')->put($storagePath, $response->body());
                    return "/storage/{$storagePath}";
                }
            } catch (\Throwable $e) {
                // If download fails or times out, keep the direct URL string as fallback
                return $cellVal;
            }
            return $cellVal;
        }

        return $cellVal;
    }

    /**
     * Normalize header row into standard column keys.
     * Maps Excel column letter ('A', 'B', ...) to standard attribute ('name', 'location', etc.).
     */
    protected function normalizeColumnMap(array $headerRow, string $type = 'universities'): array
    {
        $map = [];

        foreach ($headerRow as $colLetter => $headerText) {
            if (empty($headerText)) {
                continue;
            }

            $clean = strtolower(trim((string)$headerText));
            // Remove parenthetical content e.g. "(Required)", "(Optional)", etc.
            $clean = preg_replace('/\s*\(.*?\)/', '', $clean);
            // Replace any symbols (slashes, hyphens, etc.) with space
            $clean = preg_replace('/[^a-z0-9]/', ' ', $clean);
            // Normalize spaces to single underscore
            $clean = preg_replace('/\s+/', '_', trim($clean));

            if ($type === 'countries') {
                if (str_contains($clean, 'code') || str_contains($clean, 'iso')) {
                    $map['country_code'] = $colLetter;
                } elseif (str_contains($clean, 'subtitle') || str_contains($clean, 'headline') || str_contains($clean, 'tagline')) {
                    $map['subtitle'] = $colLetter;
                } elseif (str_contains($clean, 'featured') && !str_contains($clean, 'features')) {
                    $map['is_featured'] = $colLetter;
                } elseif (str_contains($clean, 'feature') || str_contains($clean, 'highlight') || str_contains($clean, 'tag')) {
                    $map['features'] = $colLetter;
                } elseif (str_contains($clean, 'slug')) {
                    $map['slug'] = $colLetter;
                } elseif (str_contains($clean, 'image') || str_contains($clean, 'photo') || str_contains($clean, 'cover')) {
                    $map['image'] = $colLetter;
                } elseif (str_contains($clean, 'name') || str_contains($clean, 'country') || str_contains($clean, 'destination')) {
                    $map['name'] = $colLetter;
                }
            } elseif ($type === 'universities') {
                if (str_contains($clean, 'country') || str_contains($clean, 'destination') || str_contains($clean, 'nation')) {
                    $map['country'] = $colLetter;
                } elseif (str_contains($clean, 'location') || str_contains($clean, 'campus') || str_contains($clean, 'city') || str_contains($clean, 'address')) {
                    $map['location'] = $colLetter;
                } elseif (str_contains($clean, 'website') || str_contains($clean, 'url') || str_contains($clean, 'web') || str_contains($clean, 'link')) {
                    $map['website'] = $colLetter;
                } elseif (str_contains($clean, 'logo') || str_contains($clean, 'icon')) {
                    $map['logo'] = $colLetter;
                } elseif (str_contains($clean, 'cover') || (str_contains($clean, 'image') && !str_contains($clean, 'logo')) || str_contains($clean, 'photo')) {
                    $map['cover_image'] = $colLetter;
                } elseif (str_contains($clean, 'feature') || str_contains($clean, 'highlight') || str_contains($clean, 'tag')) {
                    $map['features'] = $colLetter;
                } elseif (str_contains($clean, 'description') || str_contains($clean, 'about') || str_contains($clean, 'overview') || str_contains($clean, 'summary')) {
                    $map['description'] = $colLetter;
                } elseif (str_contains($clean, 'slug')) {
                    $map['slug'] = $colLetter;
                } elseif (str_contains($clean, 'name') || str_contains($clean, 'university') || str_contains($clean, 'institution') || str_contains($clean, 'college')) {
                    $map['name'] = $colLetter;
                }
            } elseif ($type === 'courses') {
                if (str_contains($clean, 'university') || str_contains($clean, 'institution') || str_contains($clean, 'college') || str_contains($clean, 'campus')) {
                    $map['university'] = $colLetter;
                } elseif (str_contains($clean, 'level') || str_contains($clean, 'degree') || str_contains($clean, 'academic')) {
                    $map['level'] = $colLetter;
                } elseif (str_contains($clean, 'duration') || str_contains($clean, 'length') || str_contains($clean, 'period') || str_contains($clean, 'time')) {
                    $map['duration'] = $colLetter;
                } elseif ((str_contains($clean, 'fee') || str_contains($clean, 'tuition')) && (str_contains($clean, 'show') || str_contains($clean, 'display') || str_contains($clean, 'visible'))) {
                    $map['show_tuition_fee'] = $colLetter;
                } elseif (str_contains($clean, 'fee') || str_contains($clean, 'tuition') || str_contains($clean, 'cost')) {
                    $map['tuition_fee'] = $colLetter;
                } elseif (str_contains($clean, 'intake') || str_contains($clean, 'start') || str_contains($clean, 'semester') || str_contains($clean, 'term')) {
                    $map['intake'] = $colLetter;
                } elseif (str_contains($clean, 'slug')) {
                    $map['slug'] = $colLetter;
                } elseif (str_contains($clean, 'title') || str_contains($clean, 'course') || str_contains($clean, 'program') || str_contains($clean, 'name')) {
                    $map['title'] = $colLetter;
                }
            }
        }

        return $map;
    }

    /**
     * Check if all cells in a row are blank.
     */
    protected function isRowEmpty(array $row): bool
    {
        foreach ($row as $val) {
            if (!empty(trim((string)$val))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Apply corporate styling to sample demo spreadsheets.
     */
    protected function applyTemplateStyling(Worksheet $sheet, array $headers, array $sampleRows): void
    {
        // 1. Write headers in row 1
        $sheet->fromArray([$headers], null, 'A1');

        $highestColumn = $sheet->getHighestColumn();

        // 2. Style Header Row
        $headerRange = "A1:{$highestColumn}1";
        $sheet->getRowDimension(1)->setRowHeight(32);
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
                'name' => 'Calibri',
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1E3A8A'], // Royal Dark Blue
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'wrapText' => false,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '1E293B'],
                ],
            ],
        ]);

        // 3. Write Sample Data Rows
        if (!empty($sampleRows)) {
            $sheet->fromArray($sampleRows, null, 'A2');
            for ($r = 2; $r <= count($sampleRows) + 1; $r++) {
                $sheet->getRowDimension($r)->setRowHeight(24);
            }
        }

        $highestRow = $sheet->getHighestRow();
        if ($highestRow > 1) {
            $dataRange = "A2:{$highestColumn}{$highestRow}";
            $sheet->getStyle($dataRange)->applyFromArray([
                'font' => [
                    'size' => 10,
                    'name' => 'Calibri',
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CBD5E1'],
                    ],
                ],
            ]);
        }

        // 4. Auto-size columns
        foreach (range('A', $highestColumn) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $sheet->setShowGridLines(true);
    }

    /**
     * Stream Spreadsheet download as XLSX.
     */
    protected function streamDownload(Spreadsheet $spreadsheet, string $filename): StreamedResponse
    {
        return new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'max-age=0, must-revalidate',
            'Pragma' => 'public',
        ]);
    }
}
