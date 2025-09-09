import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ins.popmars.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/profile/',
          '/subscription/cancel',
          '/*?*', // 防止重复索引带参数的页面
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/profile/',
          '/subscription/cancel',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/profile/',
          '/subscription/cancel',
        ],
        crawlDelay: 2,
      },
      {
        userAgent: 'BadBot',
        disallow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  };
}