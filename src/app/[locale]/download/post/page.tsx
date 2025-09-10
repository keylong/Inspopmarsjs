import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

// 静态生成所有语言版本
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 生成 SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'post');
}

// 服务器组件 - 无需 'use client'，可以静态生成
export default async function InstagramPostDownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 服务器端获取翻译
  const translations = {
    'zh-CN': {
      placeholder: '请输入 Instagram 帖子链接',
      subheading: '图片和视频',
      features: ['高清画质', '批量下载', '保留元数据'],
    },
    'zh-TW': {
      placeholder: '請輸入 Instagram 貼文連結',
      subheading: '圖片和影片',
      features: ['高清畫質', '批量下載', '保留元數據'],
    },
    'en': {
      placeholder: 'Enter Instagram post URL',
      subheading: 'Photos and Videos',
      features: ['HD Quality', 'Batch Download', 'Preserve Metadata'],
    },
  };
  
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  
  return (
    <DownloadPageWrapper
      locale={locale}
      contentType="post"
      translations={t}
      acceptedTypes={['post']}
    />
  );
}