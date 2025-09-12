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

// 用于首页的特殊 SEO 配置 - 优化CTR
export function generateHomeMetadata(locale: string = 'zh-CN'): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inspopmars.com';
  
  // 优化标题 - 添加吸引点击的元素
  const titles = {
    'zh-CN': 'Instagram图片/视频下载软件 - 免费批量下载工具 | 2025最新',
    'zh-TW': 'Instagram圖片/影片下載軟體 - 免費批量下載工具 | 2025最新',
    'en': 'Instagram Photo/Video Downloader - Free Bulk Download Tool | 2025'
  };
  
  // 优化描述 - 突出独特价值和数字
  const descriptions = {
    'zh-CN': '⚡秒速下载Instagram图片视频，支持批量100+链接同时处理。✅无水印✅高清原图✅Stories匿名下载。跨境电商卖家首选，已服务10万+用户。',
    'zh-TW': '⚡秒速下載IG圖片影片，支援批量100+連結同時處理。✅無浮水印✅高清原圖✅限時動態匿名下載。跨境賣家首選，已服務10萬+用戶。',
    'en': '⚡Download Instagram content in seconds. Bulk download 100+ links. ✅No watermark ✅HD quality ✅Anonymous Stories. Trusted by 100K+ e-commerce sellers.'
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
      siteName: 'Instagram图片/视频下载软件',
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