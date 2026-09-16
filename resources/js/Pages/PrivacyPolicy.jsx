import React from 'react';
import LegalPage from './LegalPage';

export default function PrivacyPolicy({ page = null }) {
    return (
        <LegalPage title="Privacy Policy" lastUpdated="August 2026" page={page} badge={null}>
            <p>
                At <strong>RMS Educational Consultancy Ltd</strong> ("Kampus EduConsult", "we", "us", or "our"), we respect your privacy and are committed to protecting the personal data of our prospective students, partner institutions, and site visitors.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">1. Information We Collect</h2>
            <p>
                We collect personal information that you voluntarily provide to us when expressing interest in obtaining information about our university admission, visa guidance, and counseling services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Personal identification details (Full Name, Date of Birth, Passport Number).</li>
                <li>Contact information (Email Address, Phone Number, WhatsApp Number, Postal Address).</li>
                <li>Academic background (Transcripts, Certificates, IELTS/TOEFL test scores, SOPs).</li>
                <li>Financial background (Sponsorship letters, bank statements for UKVI/Embassy compliance).</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">2. How We Use Your Data</h2>
            <p>
                We use the personal information collected via our website and counseling centers for business purposes described below:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>To evaluate academic eligibility for international partner universities.</li>
                <li>To submit official university applications on your behalf.</li>
                <li>To assist with student visa applications, CAS/I-20 issuance, and financial verification.</li>
                <li>To send administrative notifications regarding application deadlines and offer letters.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">3. Data Sharing & Third Parties</h2>
            <p>
                We only share personal data with partner universities, government immigration bodies (such as UKVI, US Department of State, Finnish Immigration), and verified accommodation providers strictly for fulfilling your admission and visa requests. We do not sell or rent your personal data to third-party marketers.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">4. Data Retention & Security</h2>
            <p>
                We store your data securely in encrypted cloud servers complying with GDPR and international data protection standards. Personal documents are retained only as long as necessary to complete your university admission cycle.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">5. Your Privacy Rights</h2>
            <p>
                Under applicable data protection laws, you have the right to request access to, correction of, or deletion of your personal data stored with Kampus EduConsult. You can exercise these rights anytime by contacting privacy@kampusedu.com.
            </p>
        </LegalPage>
    );
}
