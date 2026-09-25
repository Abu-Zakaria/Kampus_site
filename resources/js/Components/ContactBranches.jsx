import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Globe,
    MapPin,
    ArrowRight
} from 'lucide-react';
import BranchDetailsModal from './BranchDetailsModal';

export default function ContactBranches({ content = {} }) {
    const { props } = usePage();
    const [selectedBranch, setSelectedBranch] = useState(null);

    const branchesTitle = content?.branches_title || 'Our Global Branches';
    const branchesSubtitle = content?.branches_subtitle || 'Local offices staffed by certified counselors across South Asia, Africa, Europe, and North America.';

    const fallbackBranches = [
        { id: 1, country_code: 'GB', country_name: 'United Kingdom', cities: 'London (HQ Oxford St.)', status_text: 'Open Now' },
        { id: 2, country_code: 'BD', country_name: 'Bangladesh', cities: 'Dhaka & Sylhet', status_text: 'Open Now' },
        { id: 3, country_code: 'US', country_name: 'United States', cities: 'New York & Texas', status_text: 'Open 9 AM EST' },
        { id: 4, country_code: 'CA', country_name: 'Canada', cities: 'Toronto & Vancouver', status_text: 'Open 9 AM EST' },
        { id: 5, country_code: 'AU', country_name: 'Australia', cities: 'Sydney & Melbourne', status_text: 'Open 9 AM AEST' },
        { id: 6, country_code: 'FI', country_name: 'Finland', cities: 'Helsinki', status_text: 'Open 9 AM EET' },
        { id: 7, country_code: 'AE', country_name: 'United Arab Emirates', cities: 'Dubai', status_text: 'Open 9 AM GST' },
        { id: 8, country_code: 'NG', country_name: 'Nigeria', cities: 'Lagos & Abuja', status_text: 'Open 9 AM WAT' },
        { id: 9, country_code: 'IN', country_name: 'India', cities: 'New Delhi & Mumbai', status_text: 'Open 9:30 AM IST' },
    ];

    const branches = (props?.globalBranches && props.globalBranches.length > 0)
        ? props.globalBranches
        : fallbackBranches;

    return (
        <section className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* CENTERED HEADING */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {branchesTitle}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                        {branchesSubtitle}
                    </p>
                </div>

                {/* DYNAMIC GRID OF CLICKABLE BRANCH CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {branches.map((branch) => (
                        <div
                            key={branch.id || branch.country_code}
                            onClick={() => setSelectedBranch(branch)}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-xs"
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                {/* Square Country Code Badge */}
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-center text-sm shrink-0 border border-slate-200 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 group-hover:scale-105 transition-all">
                                    {branch.country_code}
                                </div>

                                <div className="space-y-0.5 min-w-0">
                                    <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base truncate">
                                        {branch.country_name}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                        <span className="truncate">{branch.cities}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right Arrow Action Icon */}
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:text-white dark:group-hover:border-blue-600 flex items-center justify-center transition-all shrink-0 ml-3 shadow-2xs">
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* BRANCH DETAILS MODAL WITH MAP LOCATION */}
            <BranchDetailsModal
                branch={selectedBranch}
                onClose={() => setSelectedBranch(null)}
            />
        </section>
    );
}
