import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import UniversityHeader from '../Components/UniversityHeader';
import UniversityTabs from '../Components/UniversityTabs';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';

export default function UniversityDetails({ university = null, slug = 'university-of-oxford' }) {
    // Dynamic dataset mapping based on database record or fallback map
    const universitiesMap = {
        'university-of-oxford': {
            name: 'University of Oxford',
            location: 'Oxford, Oxfordshire, United Kingdom',
            website: 'https://www.ox.ac.uk',
            ranking: '#1 Times Higher Education World University Rankings',
            coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
            logoText: 'OX',
            logoBg: 'bg-blue-900 text-white',
            established: 'Est. 1096',
            type: 'Public Research University',
            description: 'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world and the world\'s second-oldest university in continuous operation.',
            courses: [
                { code: 'CS101', name: 'BSc Computer Science', level: 'Undergraduate', duration: '3 Years Full-Time', tuition: '£35,000 / Year', intake: 'September 2026', desc: 'Comprehensive study of software engineering, artificial intelligence, data structures, and computer systems.' },
                { code: 'DS202', name: 'MSc Data Science & AI', level: 'Postgraduate', duration: '1 Year Full-Time', tuition: '£38,500 / Year', intake: 'September 2026', desc: 'Advanced machine learning, big data analytics, neural networks, and statistical modeling.' },
                { code: 'MBA90', name: 'Master of Business Administration (MBA)', level: 'Postgraduate', duration: '1 Year Full-Time', tuition: '£52,000 / Year', intake: 'September 2026', desc: 'Strategic management, financial analysis, global marketing, and executive leadership.' },
                { code: 'ENG40', name: 'MEng Engineering Science', level: 'Undergraduate', duration: '4 Years Full-Time', tuition: '£36,200 / Year', intake: 'September 2026', desc: 'Multi-disciplinary engineering covering mechanical, electrical, and civil systems.' },
            ],
            gallery: [
                { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', caption: 'Historic Quadrangle & Radcliffe Camera' },
                { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80', caption: 'Bodleian Library Study Halls' },
            ]
        },
    };

    const currentUniversity = university ? {
        name: university.name,
        location: university.location || (university.country ? university.country.name : 'United Kingdom'),
        website: university.website || '',
        ranking: university.ranking || 'Top Ranked Global Institution',
        coverImage: university.cover_image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
        logoText: university.name ? university.name.split(' ').map(w => w[0]).join('').substring(0, 3) : 'UN',
        logoBg: 'bg-blue-900 text-white',
        established: 'Est. Partner Campus',
        description: university.description || 'World-renowned partner institution providing top-tier academic degrees, research facilities, and global career prospects.',
        courses: (university.courses && university.courses.length > 0) ? university.courses.map(c => ({
            code: c.slug ? c.slug.substring(0, 6).toUpperCase() : 'CRS',
            name: c.title,
            level: c.level || 'Postgraduate',
            duration: c.duration || '1 Year Full-Time',
            tuition: c.show_tuition_fee !== false ? (c.tuition_fee || '£18,500 / Year') : 'Tuition on Request',
            show_tuition_fee: c.show_tuition_fee,
            intake: c.intake || 'September 2026',
            desc: c.description || 'Comprehensive degree program with specialized academic tracks.'
        })) : [
            { code: 'UG10', name: 'Bachelor of Science (BSc)', level: 'Undergraduate', duration: '3 Years Full-Time', tuition: '£22,000 / Year', intake: 'September 2026', desc: 'Degree program with specialized academic tracks.' },
            { code: 'PG20', name: 'Master of Science (MSc)', level: 'Postgraduate', duration: '1 Year Full-Time', tuition: '£24,500 / Year', intake: 'September 2026', desc: 'Postgraduate research & coursework degree.' },
        ],
        gallery: [
            { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', caption: 'Historic Campus Grounds' },
            { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80', caption: 'Library & Research Halls' },
        ]
    } : (universitiesMap[slug] || universitiesMap['university-of-oxford']);

    return (
        <Layout>
            <Head title={`${currentUniversity.name} — Kampus EduConsult`} />

            {/* MAIN CONTAINER WRAPPED IN LAYOUT WITH SECTION SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                
                {/* 1. UNIVERSITY HEADER WITH COVER & OVERLAPPING LOGO */}
                <UniversityHeader university={currentUniversity} />

                {/* 2. TABBED CONTENT AREA (ABOUT, GALLERY, COURSES, ADMISSION) */}
                <UniversityTabs university={currentUniversity} />

                {/* 3. 5-STEP ADMISSION ROADMAP */}
                <JourneyProcess />

                {/* 4. FREQUENTLY ASKED QUESTIONS */}
                <FaqSection />

            </div>
        </Layout>
    );
}
