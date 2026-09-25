import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Save,
    ArrowLeft,
    Globe2,
    Sparkles,
    MapPin,
    Building2,
    Tag,
    Clock,
    Phone,
    Mail,
    Map,
    Calendar
} from 'lucide-react';

const extractMapUrl = (input) => {
    if (!input) return '';
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : input;
};

export default function Form({ branch = null }) {
    const isEdit = Boolean(branch);

    const { data, setData, post, put, processing, errors } = useForm({
        country_code: branch?.country_code || '',
        country_name: branch?.country_name || '',
        cities: branch?.cities || '',
        address: branch?.address || '',
        phone: branch?.phone || '',
        email: branch?.email || '',
        map_iframe: branch?.map_iframe || '',
        booking_url: branch?.booking_url || '',
        status_text: branch?.status_text || 'Open Now',
        sort_order: branch?.sort_order ?? 0,
        is_active: branch ? Boolean(branch.is_active) : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/branches/${branch.id}`);
        } else {
            post('/admin/branches');
        }
    };

    const mapPreviewSrc = extractMapUrl(data.map_iframe);

    return (
        <AdminLayout title={isEdit ? `Edit Branch: ${branch.country_name}` : 'Create Global Branch'}>
            <Head title={`${isEdit ? 'Edit' : 'Create'} Branch —  RMS CMS`} />

            <div className="max-w-4xl mx-auto space-y-8">

                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/branches"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{isEdit ? 'UPDATE GLOBAL BRANCH' : 'NEW GLOBAL BRANCH'}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                {isEdit ? `Edit Branch: ${branch.country_name}` : 'Create New Global Branch'}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving...' : (isEdit ? 'Update Branch' : 'Save Branch')}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* MAIN FORM CARD */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                    <Globe2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                        Branch Location Details
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Configure country code, name, regional cities, and live operational status
                                    </p>
                                </div>
                            </div>

                            {/* Active Status Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_active)}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active & Displayed</span>
                            </label>
                        </div>

                        {/* Country Code & Country Name Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Country Code (e.g., GB, BD, US) *
                                </label>
                                <div className="relative">
                                    <Tag className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        maxLength="10"
                                        value={data.country_code}
                                        onChange={(e) => setData('country_code', e.target.value.toUpperCase())}
                                        placeholder="GB"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                                    />
                                </div>
                                {errors.country_code && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.country_code}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Country Name *
                                </label>
                                <div className="relative">
                                    <Globe2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={data.country_name}
                                        onChange={(e) => setData('country_name', e.target.value)}
                                        placeholder="United Kingdom"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {errors.country_name && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.country_name}</p>}
                            </div>
                        </div>

                        {/* Cities / Regional Hubs */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                Cities / Regional Hubs (e.g. London (HQ), Dhaka & Sylhet) *
                            </label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.cities}
                                    onChange={(e) => setData('cities', e.target.value)}
                                    placeholder="London (HQ Oxford St.)"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            {errors.cities && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.cities}</p>}
                        </div>

                        {/* Status Text & Sort Order Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Status Text (e.g., Open Now, Open 9 AM EST) *
                                </label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={data.status_text}
                                        onChange={(e) => setData('status_text', e.target.value)}
                                        placeholder="Open Now"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {errors.status_text && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.status_text}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Sort Order (Ascending)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.sort_order && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.sort_order}</p>}
                            </div>
                        </div>

                    </div>

                    {/* SECTION 2: PHYSICAL ADDRESS & CONTACT INFO */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Branch Contact Details
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Displayed in the branch popup modal when students click on this branch
                                </p>
                            </div>
                        </div>

                        {/* Detailed Street Address */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                Physical Address / Regional Center
                            </label>
                            <textarea
                                rows={2}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="e.g. 1st Floor, Botanical Works, 2 Jubilee Street, London E1 3FU"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                                If empty, the popup will default to showing "{data.cities || 'Regional'} Regional Center".
                            </p>
                            {errors.address && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.address}</p>}
                        </div>

                        {/* Phone & Email Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Phone / WhatsApp Number
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+44 20 7423 9333"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Contact Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admissions@ RMS-group.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Booking URL */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                Custom Consultation / Appointment URL (Optional)
                            </label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.booking_url}
                                    onChange={(e) => setData('booking_url', e.target.value)}
                                    placeholder="https://calendly.com/... (leave empty to use standard consultation popup)"
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            {errors.booking_url && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.booking_url}</p>}
                        </div>

                    </div>

                    {/* SECTION 3: MAP LOCATION EMBED */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <Map className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Google Map Location
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Embed an interactive map that appears directly inside the branch details popup
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                Google Maps Embed (URL or &lt;iframe&gt; Code)
                            </label>
                            <textarea
                                rows={3}
                                value={data.map_iframe}
                                onChange={(e) => setData('map_iframe', e.target.value)}
                                placeholder="Paste Google Maps embed URL (https://www.google.com/maps/embed?...) or complete <iframe> HTML code from Google Maps"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                                Tip: On Google Maps, search for the branch location, click "Share" → "Embed a map" → copy and paste it here.
                            </p>
                            {errors.map_iframe && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.map_iframe}</p>}
                        </div>

                        {/* Live Map Preview inside the card */}
                        {mapPreviewSrc ? (
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Interactive Map Preview:
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-44 bg-slate-900">
                                    <iframe
                                        title="Branch Map Preview"
                                        src={mapPreviewSrc}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
                                Paste a Google Maps embed URL or &lt;iframe&gt; to preview the interactive map location here.
                            </div>
                        )}

                    </div>

                    {/* LIVE POPUP MODAL PREVIEW */}
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                Live Student Popup Modal Preview
                            </span>
                            <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2.5 py-0.5 rounded-full font-bold">
                                Exactly as shown to users
                            </span>
                        </div>

                        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                                    {data.country_code || 'BD'}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Regional Office</span>
                                    <h3 className="text-xl font-extrabold truncate">{data.country_name || 'Bangladesh'}</h3>
                                    <p className="text-xs text-slate-500 truncate">{data.cities || 'Dhaka & Sylhet'}</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span className="leading-snug">{data.address || `${data.cities || 'Dhaka & Sylhet'} Regional Center`}</span>
                                </div>
                                {data.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>{data.phone}</span>
                                    </div>
                                )}
                                {data.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                                        <span>{data.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                                    <span className="text-teal-600 dark:text-teal-400 font-bold">{data.status_text || 'Open Now'}</span>
                                </div>
                            </div>

                            {/* Map Preview in Modal */}
                            {mapPreviewSrc && (
                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-36 bg-slate-900">
                                    <iframe
                                        title="Modal Map Preview"
                                        src={mapPreviewSrc}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md cursor-default pointer-events-none"
                            >
                                Book Consultation for {data.country_name || 'Bangladesh'}
                            </button>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON FOOTER */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/admin/branches"
                            className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-all cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : (isEdit ? 'Update Branch' : 'Create Branch')}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
