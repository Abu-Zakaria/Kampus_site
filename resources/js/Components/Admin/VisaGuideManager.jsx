import React, { useState } from 'react';
import {
    FileCheck,
    Sparkles,
    Globe,
    Clock,
    DollarSign,
    CheckCircle2,
    Plus,
    Trash2,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const DEFAULT_VISA_DATA = {
    UK: {
        country: 'United Kingdom',
        flag: '🇬🇧',
        visaType: 'Student Visa (formerly Tier 4)',
        casFee: 'CAS Deposit (varies)',
        ihsFee: '£776 / year (Health Surcharge)',
        visaFee: '£490 (Outside UK)',
        processingTime: '3 - 4 Weeks (Priority 5 Days)',
        checklist: [
            'Valid Passport (at least 6 months validity)',
            'CAS (Confirmation of Acceptance for Studies) from University',
            'Bank Statement (28 days holding period proof)',
            'TB Test Certificate (from approved clinic)',
            'Academic Certificates & IELTS / Medium of Instruction Letter',
            'ATAS Clearance Certificate (if applicable for STEM subjects)'
        ],
        steps: [
            { step: '01', title: 'Get Unconditional Offer & CAS', desc: 'Secure your university admission and pay the required deposit to obtain your CAS statement.' },
            { step: '02', title: 'Prepare 28-Day Financial Proof', desc: 'Maintain required tuition fee balance + £1,334/month living costs (London) in your bank for 28 consecutive days.' },
            { step: '03', title: 'Pay Visa Fee & IHS Online', desc: 'Complete the UKVI online visa application, pay the Immigration Health Surcharge and visa fee.' },
            { step: '04', title: 'Biometrics & Passport Submission', desc: 'Attend your appointment at VFS Global / TLScontact for fingerprinting, photo, and document submission.' }
        ]
    },
    USA: {
        country: 'United States',
        flag: '🇺🇸',
        visaType: 'F-1 Academic Student Visa',
        casFee: 'SEVIS I-901 Fee ($350)',
        ihsFee: 'Health Insurance (Required)',
        visaFee: '$185 (MRV Fee)',
        processingTime: '2 - 6 Weeks (Embassy Slot Dependent)',
        checklist: [
            'Valid Passport & Form I-20 issued by US University',
            'SEVIS I-901 Fee Payment Receipt ($350)',
            'DS-160 Online Nonimmigrant Visa Application Confirmation Page',
            'Bank Financial Statement & Affidavit of Support',
            'Academic Transcripts, SAT/GRE/TOEFL/IELTS Score Reports',
            'Standardized Interview Appointment Confirmation Sheet'
        ],
        steps: [
            { step: '01', title: 'Receive Form I-20', desc: 'Accept your admission offer and submit financial verification to get your university I-20 document.' },
            { step: '02', title: 'Pay SEVIS I-901 Fee', desc: 'Pay the mandatory $350 SEVIS fee online at fmjfee.com and save the receipt.' },
            { step: '03', title: 'Complete DS-160 & Schedule Interview', desc: 'Fill out DS-160 form online, pay MRV fee, and book your US Embassy visa interview date.' },
            { step: '04', title: 'US Embassy Visa Interview', desc: 'Attend your in-person interview with your I-20, financial documents, and academic credentials.' }
        ]
    },
    Finland: {
        country: 'Finland',
        flag: '🇫🇮',
        visaType: 'First Residence Permit for Studies',
        casFee: 'Tuition Deposit Payment Receipt',
        ihsFee: 'Private Health Insurance (SIP/Swisscare)',
        visaFee: '€350 (Electronic Application)',
        processingTime: '1 - 3 Months',
        checklist: [
            'Valid Passport',
            'Official Acceptance Letter from Finnish University / UAS',
            'Proof of Funds (€6,720 / year living expenses in bank account)',
            'Comprehensive Health Insurance (coverage up to €120,000)',
            'Degree Certificates & Legalized Transcripts',
            'Receipt of Paid Tuition Fee or Scholarship Award Letter'
        ],
        steps: [
            { step: '01', title: 'Accept Offer & Pay Tuition Fee', desc: 'Confirm your study place in Opintopolku and pay tuition fee to receive official acceptance letter.' },
            { step: '02', title: 'Purchase Health Insurance', desc: 'Obtain approved international student health insurance policy covering the entire duration of studies.' },
            { step: '03', title: 'Submit EnterFinland Application', desc: 'Create EnterFinland account, complete residence permit application and upload scanned documents.' },
            { step: '04', title: 'VFS Identification & Biometrics', desc: 'Visit Finnish Embassy / VFS Application Centre to verify original documents and record biometrics.' }
        ]
    },
    Dubai: {
        country: 'Dubai (UAE)',
        flag: '🇦🇪',
        visaType: 'Student Residence Visa',
        casFee: 'University Security Deposit',
        ihsFee: 'UAE Mandatory Medical Insurance',
        visaFee: 'AED 3,000 - 4,500 (Varies by Univ)',
        processingTime: '2 - 3 Weeks (Fast Track 7 Days)',
        checklist: [
            'Valid Passport (at least 6 months validity)',
            'University Admission Offer Letter & Tuition Fee Receipt',
            'Passport Size Photographs (White background)',
            'UAE Medical Fitness Test Clearance (Done in Dubai)',
            'Emirates ID Biometrics Registration Receipt',
            'Academic Transcripts and Attested Certificates'
        ],
        steps: [
            { step: '01', title: 'University Entry Permit (EVisa)', desc: 'University applies for your 60-day Entry Permit visa upon receiving tuition fees and deposit.' },
            { step: '02', title: 'Arrive in Dubai & Medical Test', desc: 'Enter the UAE with entry permit and undergo mandatory blood test and chest X-ray at preventive health center.' },
            { step: '03', title: 'Biometrics for Emirates ID', desc: 'Visit Federal Authority for Identity and Citizenship (ICP) service center for fingerprint scanning.' },
            { step: '04', title: 'Visa Stamping & Residency Card', desc: 'University submits completed medical & biometrics reports to stamp residence visa and receive Emirates ID.' }
        ]
    }
};

export default function VisaGuideManager({ content = {}, onChange }) {
    const visaDestinations = content.visa_destinations || DEFAULT_VISA_DATA;
    const destinationKeys = Object.keys(visaDestinations);
    const [selectedDest, setSelectedDest] = useState(destinationKeys[0] || 'UK');
    const [newChecklistText, setNewChecklistText] = useState('');

    const currentData = visaDestinations[selectedDest] || DEFAULT_VISA_DATA[selectedDest] || {
        country: selectedDest,
        flag: '🌐',
        visaType: '',
        casFee: '',
        ihsFee: '',
        visaFee: '',
        processingTime: '',
        checklist: [],
        steps: []
    };

    const updateDestField = (field, value) => {
        const nextDestinations = {
            ...visaDestinations,
            [selectedDest]: {
                ...currentData,
                [field]: value
            }
        };
        onChange({
            ...content,
            visa_destinations: nextDestinations
        });
    };

    const handleAddChecklistItem = () => {
        if (!newChecklistText.trim()) return;
        const currentList = currentData.checklist || [];
        updateDestField('checklist', [...currentList, newChecklistText.trim()]);
        setNewChecklistText('');
    };

    const handleRemoveChecklistItem = (index) => {
        const currentList = currentData.checklist || [];
        updateDestField('checklist', currentList.filter((_, i) => i !== index));
    };

    const handleUpdateChecklistItem = (index, value) => {
        const currentList = [...(currentData.checklist || [])];
        currentList[index] = value;
        updateDestField('checklist', currentList);
    };

    const handleUpdateStep = (stepIndex, field, value) => {
        const currentSteps = [...(currentData.steps || [])];
        currentSteps[stepIndex] = {
            ...(currentSteps[stepIndex] || {}),
            [field]: value
        };
        updateDestField('steps', currentSteps);
    };

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Student Visa Guide Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure destination requirements, fees, processing timelines, document checklists, and application step guides
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Visa Guide Customizer</span>
                </span>
            </div>

            {/* DESTINATION COUNTRY TAB SWITCHER */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Select Destination Country To Edit:
                </label>
                <div className="flex flex-wrap gap-2">
                    {destinationKeys.map((key) => {
                        const dest = visaDestinations[key];
                        const isActive = selectedDest === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelectedDest(key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                <span className="text-base">{dest?.flag || '🌐'}</span>
                                <span>{dest?.country || key}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ACTIVE DESTINATION FORM SECTION */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{currentData.flag}</span>
                        <div>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                {currentData.country} Visa Parameters
                            </h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {currentData.visaType}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Country Name & Visa Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Visa Type Title
                        </label>
                        <input
                            type="text"
                            value={currentData.visaType || ''}
                            onChange={(e) => updateDestField('visaType', e.target.value)}
                            placeholder="e.g. Student Visa (formerly Tier 4)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Processing Timeline
                        </label>
                        <input
                            type="text"
                            value={currentData.processingTime || ''}
                            onChange={(e) => updateDestField('processingTime', e.target.value)}
                            placeholder="e.g. 3 - 4 Weeks (Priority 5 Days)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Fees Grid (3 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            CAS / Deposit Fee
                        </label>
                        <input
                            type="text"
                            value={currentData.casFee || ''}
                            onChange={(e) => updateDestField('casFee', e.target.value)}
                            placeholder="e.g. CAS Deposit (varies)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Health Surcharge / Insurance
                        </label>
                        <input
                            type="text"
                            value={currentData.ihsFee || ''}
                            onChange={(e) => updateDestField('ihsFee', e.target.value)}
                            placeholder="e.g. £776 / year"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Visa Application Fee
                        </label>
                        <input
                            type="text"
                            value={currentData.visaFee || ''}
                            onChange={(e) => updateDestField('visaFee', e.target.value)}
                            placeholder="e.g. £490 (Outside UK)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* DOCUMENT CHECKLIST ITEMS */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Document Checklist Items ({currentData.checklist?.length || 0})
                    </label>

                    <div className="space-y-2">
                        {(currentData.checklist || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-slate-400 w-6 text-right">
                                    {idx + 1}.
                                </span>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleUpdateChecklistItem(idx, e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveChecklistItem(idx)}
                                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new checklist item */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="text"
                            value={newChecklistText}
                            onChange={(e) => setNewChecklistText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddChecklistItem();
                                }
                            }}
                            placeholder="Add a new required document..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddChecklistItem}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>

                {/* 4-STEP PROCESS GUIDE */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        4-Step Application Walkthrough
                    </label>

                    <div className="space-y-4">
                        {(currentData.steps || []).map((st, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2"
                            >
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                                        Step {st.step || `0${idx + 1}`}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <div className="sm:col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            Step Title
                                        </label>
                                        <input
                                            type="text"
                                            value={st.title || ''}
                                            onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                                            placeholder="Step Title"
                                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="sm:col-span-8">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            Step Description
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={st.desc || ''}
                                            onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                                            placeholder="Detailed description of this step..."
                                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
