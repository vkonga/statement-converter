import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://econverter.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'], // Example disallowed paths
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
