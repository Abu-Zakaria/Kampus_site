<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_no',
        'user_id',
        'university_id',
        'course_id',
        'university_name',
        'course_title',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'intake',
        'level',
        'duration',
        'tuition_fee',
        'status',
        'notes',
        'counselor_remarks',
        'status_history',
        'applied_at',
        'status_updated_at',
    ];

    protected $casts = [
        'status_history' => 'array',
        'applied_at' => 'datetime',
        'status_updated_at' => 'datetime',
    ];

    /**
     * Associated Student User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Associated University (optional).
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Associated Course (optional).
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Stages definition with label, description, and order.
     */
    public static function getStages(): array
    {
        return [
            'pending' => [
                'index' => 1,
                'label' => 'Application Submitted',
                'description' => 'Your application has been received and queued for initial counselor evaluation.',
                'badge_color' => 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
            ],
            'processing' => [
                'index' => 2,
                'label' => 'Document Review & Processing',
                'description' => 'Our counseling team is auditing your academic credentials, statement of purpose, and prerequisites.',
                'badge_color' => 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
            ],
            'submitted_to_university' => [
                'index' => 3,
                'label' => 'Submitted to University',
                'description' => 'Official dossier formally lodged with the university international admissions committee.',
                'badge_color' => 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
            ],
            'offer_issued' => [
                'index' => 4,
                'label' => 'Offer Letter Issued',
                'description' => 'Congratulations! The university has issued an offer of admission.',
                'badge_color' => 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
            ],
            'visa_processing' => [
                'index' => 5,
                'label' => 'Visa Lodgement & Processing',
                'description' => 'Embassy appointment scheduled, CAS/I-20 secured, and student visa application lodged.',
                'badge_color' => 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
            ],
            'accepted' => [
                'index' => 6,
                'label' => 'Accepted & Enrolled',
                'description' => 'Visa approved and official campus matriculation confirmed.',
                'badge_color' => 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
            ],
            'rejected' => [
                'index' => 0,
                'label' => 'Unsuccessful / Closed',
                'description' => 'Application could not proceed or was retracted.',
                'badge_color' => 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
            ],
        ];
    }
}
