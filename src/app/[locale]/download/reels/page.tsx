import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'reels');
}

export default async function ReelsDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入 Reels 链接', subheading: 'Reels 短视频', features: ['高清视频', '无水印', '快速下载'] },
    'zh-TW': { placeholder: '請輸入 Reels 連結', subheading: 'Reels 短影片', features: ['高清影片', '無水印', '快速下載'] },
    'en': { placeholder: 'Enter Reels URL', subheading: 'Reels Videos', features: ['HD Video', 'No Watermark', 'Fast Download'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="reels" translations={t} acceptedTypes={['reels']} />;
}
