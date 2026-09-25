import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import PartnerHero from '../Components/PartnerHero';
import PartnerBenefits from '../Components/PartnerBenefits';
import PartnerForm from '../Components/PartnerForm';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';

export default function Partner() {
    return (
        <Layout>
            <Head title="Become a Partner —  RMS Global Education" />

            <div className="w-full flex flex-col space-y-0 selection:bg-purple-600 selection:text-white">
                {/* 1. PARTNER HERO SECTION */}
                <PartnerHero />

                {/* 2. PARTNER BENEFITS GRID */}
                <PartnerBenefits />

                {/* 3. APPLICATION FORM COMPONENT */}
                <PartnerForm />

                {/* 4. ADMISSION ROADMAP */}
                <JourneyProcess />

                {/* 5. FAQ ACCORDION SECTION */}
                <FaqSection />
            </div>
        </Layout>
    );
}
