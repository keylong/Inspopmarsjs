import { Metadata } from 'next';
import { contentTypeConfigs, ContentType } from '@/lib/seo/config';

export function generateSEOMetadata(
  contentType: ContentType,
  locale: string = 'zh-CN'
): Metadata {
  const config = contentTypeConfigs[contentType];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inspopmars.com';
  
  // 根据语言调整路径
  const localePath = locale === 'zh-CN' ? '' : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePath}${config.canonicalPath}`;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    authors: [{ name: 'Inspopmars' }],
    creator: 'Inspopmars',
    publisher: 'Inspopmars',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-CN': `${baseUrl}${config.canonicalPath}`,
        'zh-TW': `${baseUrl}/zh-TW${config.canonicalPath}`,
        'en': `${baseUrl}/en${config.canonicalPath}`,
      },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: 'Inspopmars - Instagram下载器',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: locale === 'zh-CN' ? 'zh_CN' : locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@inspopmars',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 用于首页的特殊 SEO 配置
export function generateHomeMetadata(locale: string = 'zh-CN'): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inspopmars.com';
  
  const titles = {
    'zh-CN': 'Instagram下载器 - 免费下载Instagram视频、图片、Reels和Stories',
    'zh-TW': 'Instagram下載器 - 免費下載Instagram影片、圖片、Reels和Stories',
    'en': 'Instagram Downloader - Free Download Instagram Videos, Photos, Reels & Stories'
  };
  
  const descriptions = {
    'zh-CN': '最好的Instagram下载工具，支持下载Instagram视频、图片、Reels、Stories和IGTV。高清质量，快速安全，完全免费。',
    'zh-TW': '最好的Instagram下載工具，支援下載Instagram影片、圖片、Reels、Stories和IGTV。高清品質，快速安全，完全免費。',
    'en': 'The best Instagram downloader for videos, photos, Reels, Stories and IGTV. HD quality, fast and secure, completely free.'
  };
  
  return {
    title: titles[locale as keyof typeof titles] || titles['zh-CN'],
    description: descriptions[locale as keyof typeof descriptions] || descriptions['zh-CN'],
    keywords: 'Instagram下载,Instagram视频下载,Instagram图片下载,Reels下载,Stories下载,IGTV下载,Instagram downloader',
    alternates: {
      canonical: baseUrl,
      languages: {
        'zh-CN': baseUrl,
        'zh-TW': `${baseUrl}/zh-TW`,
        'en': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles['zh-CN'],
      description: descriptions[locale as keyof typeof descriptions] || descriptions['zh-CN'],
      url: baseUrl,
      siteName: 'Inspopmars',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles['zh-CN'],
      description: descriptions[locale as keyof typeof descriptions] || descriptions['zh-CN'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}