import React from 'react';
import {
    Award,
    Users,
    Star,
    CheckCircle2,
    Building2,
    Globe2,
    ShieldCheck,
    Sparkles
} from 'lucide-react';

export default function AboutHero({ content = {} }) {
    const heading = content?.hero_heading || content?.hero?.title;
    const subtitle = content?.hero_subtitle || content?.hero?.subtitle;
    const badgeText = content?.badge_text || content?.hero?.badge;

    // Resolve hero image with fallback handling
    const rawHeroImage = content?.hero_image || content?.hero?.image || '';
    const heroImage = (rawHeroImage && typeof rawHeroImage === 'string' && rawHeroImage.trim().length > 0)
        ? (rawHeroImage.startsWith('http') || rawHeroImage.startsWith('/') ? rawHeroImage : `/storage/${rawHeroImage}`)
        : null;

    const overlayOpacity = content?.hero_overlay_opacity !== undefined && content?.hero_overlay_opacity !== null && content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(content.hero_overlay_opacity, 10)))
        : 75;

    const defaultStats = [
        {
            number: '24',
            suffix: 'Years',
            label: 'of experience',
            icon: Award,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-950/60'
        },
        {
            number: '10,000+',
            suffix: 'Students',
            label: 'placed globally',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-100 dark:bg-indigo-950/60'
        },
        {
            number: '4.8/5',
            suffix: 'Rating',
            label: 'Student rating',
            icon: Star,
            color: 'text-amber-500 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-950/60'
        },
        {
            number: '100%',
            suffix: 'Free',
            label: 'Free services',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-950/60'
        },
    ];

    const stats = (content?.stats && Array.isArray(content.stats) && content.stats.length === 4)
        ? content.stats.map((st, i) => ({
            ...defaultStats[i % defaultStats.length],
            number: st.number || defaultStats[i].number,
            suffix: st.suffix || defaultStats[i].suffix,
            label: st.label || defaultStats[i].label,
            icon: defaultStats[i % defaultStats.length].icon,
            color: defaultStats[i % defaultStats.length].color,
            bgColor: defaultStats[i % defaultStats.length].bgColor,
        }))
        : defaultStats;

    const defaultTrustBadges = [
        { icon: Building2, text: 'Headquartered in London, UK', color: 'text-blue-500 dark:text-blue-400' },
        { icon: Globe2, text: 'Presence in 15+ Countries', color: 'text-indigo-500 dark:text-indigo-400' },
        { icon: ShieldCheck, text: 'ICEF & British Council Certified', color: 'text-emerald-500 dark:text-emerald-400' },
    ];

    const trustBadges = (content?.trust_badges && Array.isArray(content.trust_badges) && content.trust_badges.length > 0)
        ? content.trust_badges.map((b, i) => {
            const txt = typeof b === 'string' ? b : (b?.text || defaultTrustBadges[i % defaultTrustBadges.length].text);
            return {
                ...defaultTrustBadges[i % defaultTrustBadges.length],
                text: txt,
            };
        })
        : defaultTrustBadges;

    return (
        <section className={`relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/60 dark:border-slate-800 transition-colors ${heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
            }`}>

            {/* HERO BANNER IMAGE BACKGROUND WITH DYNAMIC CONTRAST OVERLAYS */}
            {heroImage ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src={heroImage}
                        alt="About Us Hero Banner"
                        className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* Dark Scrim with Configurable Opacity */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70"
                        style={{ opacity: overlayOpacity / 100 }}
                    />

                    {/* Subtle Vertical Fade Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

                    {/* Ambient Glow Orbs over banner */}
                    <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/25 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute top-[100px] right-[-100px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
                </div>
            ) : (
                /* Ambient Glows fallback when no background image */
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden">
                    <div className="absolute top-[-80px] left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px]" />
                    <div className="absolute top-[80px] right-[10%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[130px]" />
                </div>
            )}

            {/* Subtle Pattern Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* HERO HEADER & TYPOGRAPHY */}
                <div className="max-w-3xl space-y-5 text-left">

                    {/* Dynamic Hero Badge / Tagline */}
                    {badgeText && (
                        <div>
                            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${heroImage
                                ? 'bg-blue-600/30 text-blue-200 border border-blue-400/40 backdrop-blur-md'
                                : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                }`}>
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                <span>{badgeText}</span>
                            </span>
                        </div>
                    )}

                    {/* Main Heading */}
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${heroImage ? 'text-white drop-shadow-sm' : 'text-slate-900 dark:text-white'
                        }`}>
                        {heading ? (
                            heading
                        ) : (
                            <>
                                UK's trusted international <br className="hidden sm:inline" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                                    student advisors.
                                </span>
                            </>
                        )}
                    </h1>

                    {/* Main Paragraph */}
                    <p className={`text-lg sm:text-xl leading-relaxed font-normal max-w-3xl ${heroImage ? 'text-slate-200 drop-shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                        {subtitle || 'Kampus Group Ltd is a London-headquartered international student recruitment agency with 24 years of experience and a strong global presence across South Asia, Africa and Europe. We help ambitious students access world-class education — securing placements across law, economics, medicine, engineering and business.'}
                    </p>

                    {/* Trust Badges Bar */}
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                        {trustBadges.map((badge, idx) => {
                            const IconComponent = badge.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-2xs transition-all ${heroImage
                                        ? 'bg-slate-900/80 text-slate-200 border-slate-700/80 backdrop-blur-md'
                                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
                                        }`}
                                >
                                    <IconComponent className={`w-4 h-4 ${badge.color}`} />
                                    <span>{badge.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* HORIZONTAL STATS GRID (4 COLUMNS DESKTOP, 2 COLUMNS MOBILE) */}
                <div className={`mt-14 lg:mt-16 pt-10 border-t ${heroImage ? 'border-white/15' : 'border-slate-200/80 dark:border-slate-800'
                    }`}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat, idx) => {
                            const IconComponent = stat.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border transition-all duration-300 group ${heroImage
                                        ? 'bg-slate-900/80 hover:bg-slate-900/95 border-slate-700/70 hover:border-blue-400/50 backdrop-blur-md shadow-xl'
                                        : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${heroImage ? 'text-slate-300' : 'text-slate-400'
                                            }`}>
                                            {stat.suffix}
                                        </span>
                                    </div>

                                    {/* Large Bold Number */}
                                    <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                                        }`}>
                                        {stat.number}
                                    </div>

                                    {/* Subtle Label */}
                                    <div className={`text-xs sm:text-sm font-medium mt-1 ${heroImage ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                        }`}>
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div >
        </section >
    );
}
