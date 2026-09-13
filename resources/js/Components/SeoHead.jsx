import { Head, usePage } from '@inertiajs/react';

export default function SeoHead({ title, description, image, url }) {
    const { globalSettings } = usePage().props;
    
    const siteName = globalSettings?.site_name || 'Kampus Edu';
    const metaTitle = title ? `${title} | ${siteName}` : siteName;
    const metaDesc = description || globalSettings?.default_meta_description || 'Global education consultancy services.';
    const metaImage = image || (globalSettings?.default_meta_image ? `/storage/${globalSettings.default_meta_image}` : '/default-og-image.jpg');

    return (
        <Head>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDesc} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={metaImage} />
            {url && <meta property="og:url" content={url} />}
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
    );
}
