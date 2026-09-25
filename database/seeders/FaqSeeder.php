<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Where can I study with  RMS Global Education?',
                'answer' => 'We partner with over 500+ top-ranked universities across the UK, USA, Canada, Australia, Finland, Germany, Ireland, and Dubai (UAE). Our senior education counselors analyze your academic background, budget, and career aspirations to shortlist the ideal target institutions.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Can I get a full or partial scholarship for my studies?',
                'answer' => 'Yes! Most of our partner universities offer merit-based scholarships, country-specific grants, and tuition fee waivers ranging from £2,000 up to 100% full tuition coverage. We guide you through writing compelling personal statements, portfolio preparation, and scholarship applications.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'What are the IELTS and English language proficiency requirements?',
                'answer' => 'Universities typically accept IELTS Academic (overall 6.0 – 7.5), PTE Academic, TOEFL iBT, or Duolingo English Tests. Additionally, several UK, Finnish, and European partner universities offer IELTS waivers based on Medium of Instruction (MOI) certificates from accredited institutions.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Are  RMS consultancy and visa guidance services really 100% free?',
                'answer' => 'Yes, 100%! Our counseling, university application processing, document review, and visa guidance services are completely free for students. We are officially contracted and funded directly by our partner universities globally.',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'How much does it cost to live and study in the UK, USA, & Europe?',
                'answer' => 'Living costs vary by destination. For the UK, UKVI guidelines estimate living costs at approximately £9,207/year (outside London) and £12,006/year (inside London). In the USA, estimated living costs range from $10,000 to $18,000/year, while Finland and Germany offer low or zero tuition fees with living budgets around €800 - €1,000/month.',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'question' => 'How long does it take to receive a university offer letter?',
                'answer' => 'Conditional offer letters are usually issued within 48 hours to 2 weeks, depending on the university and course selection. Our direct university admissions portal ensures your profile is reviewed with fast-track priority.',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'question' => 'Can I work part-time while studying abroad?',
                'answer' => 'Yes! International students on a valid student visa can work up to 20 hours per week during term time and full-time (up to 40 hours per week) during scheduled vacations in the UK, USA (on-campus), Canada, Australia, and Finland.',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'question' => 'What are the Post-Study Work (PSW) visa rights after graduation?',
                'answer' => 'Graduates in the UK are eligible for a 2-year Graduate Route visa (3 years for PhD). The USA offers 1 to 3 years of OPT (STEM extension). Canada provides up to 3 years of PGWP, and Australia grants 2 to 4 years of Temporary Graduate work rights.',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'question' => 'Can I bring my spouse or dependents with me on a student visa?',
                'answer' => 'In countries like Finland, Canada, and Australia, postgraduate and PhD students can bring spouses (who often receive open work permits) and children. In the UK, postgraduate research and government-sponsored students are eligible for dependent visas.',
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'question' => 'What documents are needed to begin my application process?',
                'answer' => 'You will need: (1) Valid Passport, (2) Academic certificates & transcripts (SSC, HSC, Bachelor\'s), (3) English proficiency score (or MOI letter), (4) Statement of Purpose (SOP), (5) Two Academic/Professional Reference Letters (LOR), and (6) Updated CV/Resume.',
                'sort_order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }
    }
}
