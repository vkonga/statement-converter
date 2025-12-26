import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://your-domain.com'; // TODO: Replace with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'], // Example disallowed paths
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
