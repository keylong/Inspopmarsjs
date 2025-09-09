import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ins.popmars.com';
  
  // 基础页面路径
  const routes = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'daily' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/download',
      priority: 0.9,
      changeFrequency: 'daily' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/download/post',
      priority: 0.8,
      changeFrequency: 'daily' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/download/stories',
      priority: 0.8,
      changeFrequency: 'daily' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/download/reels',
      priority: 0.8,
      changeFrequency: 'daily' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/download/igtv',
      priority: 0.8,
      changeFrequency: 'daily' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/about',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/privacy',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/terms',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/profile',
      priority: 0.5,
      changeFrequency: 'weekly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/subscription',
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/auth/signin',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
    {
      path: '/auth/signup',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
      lastModified: new Date('2024-09-09T00:00:00Z'),
    },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // 为每种语言生成sitemap条目
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route.path}`])
          ),
        },
      });
    });
  });

  // 为根路径（无语言前缀）生成条目
  routes.forEach((route) => {
    sitemap.push({
      url: `${baseUrl}${route.path}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        canonical: `${baseUrl}/zh-CN${route.path}`,
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${route.path}`])
        ),
      },
    });
  });

  return sitemap;
}