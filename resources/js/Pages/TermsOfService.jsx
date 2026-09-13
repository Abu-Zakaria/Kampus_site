import React from 'react';
import LegalPage from './LegalPage';

export default function TermsOfService({ page = null }) {
    return (
        <LegalPage title="Terms of Service" lastUpdated="August 2026" page={page} badge={null}>
            <p>
                Welcome to <strong>Kampus Educational Consultancy Ltd</strong>. By accessing our website or using our counseling, university placement, and visa advisory services, you agree to comply with and be bound by the following Terms of Service.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">1. Scope of Services</h2>
            <p>
                Kampus EduConsult acts as an educational consultancy facilitating student applications to recognized partner universities across the UK, USA, Canada, Australia, Finland, and Dubai. Our services include profile evaluation, document verification, application submission, and visa guidance.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">2. Admission & Visa Guarantees</h2>
            <p>
                While we maintain a high success rate (98% visa approval rate), final admission decisions and visa grants are solely at the discretion of the respective university admissions boards and government embassy/immigration authorities (UKVI, US Embassy, etc.). Kampus EduConsult does not guarantee university admission or visa issuance.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">3. Student Responsibilities</h2>
            <p>
                Students are responsible for providing authentic, accurate, and non-fraudulent academic certificates, bank statements, and personal credentials. Providing false or forged documentation will lead to immediate termination of services without recourse.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">4. Fees & Payments</h2>
            <p>
                Initial counseling and partner university placement guidance provided by Kampus EduConsult is free for students. Third-party fees (such as university application fees, UKVI visa fees, SEVIS I-901 fees, and IHS health surcharges) are paid directly to official governing authorities by the student.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">5. Intellectual Property</h2>
            <p>
                All website design, text, graphics, logos, and software content belong exclusively to Kampus Educational Consultancy Ltd. Unauthorized duplication or distribution is strictly prohibited.
            </p>
        </LegalPage>
    );
}
