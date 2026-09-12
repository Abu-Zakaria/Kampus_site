<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'name' => 'Hasanuzzaman Priyam',
                'role' => 'Managing Director & Founder',
                'department' => 'Executive Leadership (London HQ)',
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                'quote' => 'Our purpose is clear: removing every barrier between ambitious students and world-leading global universities.',
                'email' => 'priyam@kampusedu.com',
                'linkedin_url' => 'https://linkedin.com',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Eleanor Vance',
                'role' => 'Head of UK Admissions & Partnerships',
                'department' => 'University Partnerships (London)',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'quote' => 'Matching students with the right academic faculty transforms potential into extraordinary lifelong careers.',
                'email' => 'eleanor.vance@kampusedu.com',
                'linkedin_url' => 'https://linkedin.com',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Marcus Sterling',
                'role' => 'Director of Student Visa & Immigration',
                'department' => 'Compliance & UKVI Affairs',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                'quote' => 'Navigating immigration compliance demands precision, absolute integrity, and continuous student care.',
                'email' => 'm.sterling@kampusedu.com',
                'linkedin_url' => 'https://linkedin.com',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Nusrat Chowdhury',
                'role' => 'Regional Director — South Asia',
                'department' => 'Regional Operations (Dhaka)',
                'image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
                'quote' => 'Providing transparent, zero-cost counsel empowers families to make life-changing international choices.',
                'email' => 'nusrat.c@kampusedu.com',
                'linkedin_url' => 'https://linkedin.com',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'David O\'Connor',
                'role' => 'Senior Higher Education Consultant',
                'department' => 'Admissions & Scholarships',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
                'quote' => 'Securing generous scholarships for deserving students is the most rewarding aspect of our mission.',
                'email' => 'david.o@kampusedu.com',
                'linkedin_url' => 'https://linkedin.com',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Amara Diallo',
                'role' => 'Lead Student Welfare & Pre-Departure Advisor',
                'department' => 'Student Experience & Relocation',
                'image' => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
                'quote' => 'Support doesn’t end with visa approval; we ensure every student feels safe, welcome, and ready to thrive.',
                'email' => 'amara.d@kampusedu.com',
                'linkedin_url' => 'https://linkedin.com',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($employees as $emp) {
            Employee::updateOrCreate(
                ['email' => $emp['email']],
                $emp
            );
        }

        // Seed Company Employee & Team settings
        Setting::updateOrCreate(
            ['key' => 'company_employee_count'],
            ['value' => '65+ Global Team Members']
        );

        Setting::updateOrCreate(
            ['key' => 'company_employee_stat_subtext'],
            ['value' => 'Dedicated education consultants, visa case officers, and support staff across 15+ countries worldwide.']
        );

        Setting::updateOrCreate(
            ['key' => 'company_team_heading'],
            ['value' => 'Meet our global education leadership']
        );

        Setting::updateOrCreate(
            ['key' => 'company_team_subheading'],
            ['value' => 'Driven by ethics, academic expertise, and student success, our multi-disciplinary team brings decades of university admissions experience.']
        );
    }
}
