import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'igtv');
}

export default async function IGTVDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入 IGTV 链接', subheading: 'IGTV 长视频', features: ['长视频下载', '高清质量', '支持字幕'] },
    'zh-TW': { placeholder: '請輸入 IGTV 連結', subheading: 'IGTV 長影片', features: ['長影片下載', '高清品質', '支援字幕'] },
    'en': { placeholder: 'Enter IGTV URL', subheading: 'IGTV Videos', features: ['Long Videos', 'HD Quality', 'Subtitle Support'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="igtv" translations={t} acceptedTypes={['igtv']} />;
}
