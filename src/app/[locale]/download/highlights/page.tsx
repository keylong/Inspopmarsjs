import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'highlights');
}

export default async function HighlightsDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入精选链接', subheading: '精选集锦', features: ['精选合集', '永久保存', '批量下载'] },
    'zh-TW': { placeholder: '請輸入精選連結', subheading: '精選集錦', features: ['精選合集', '永久保存', '批量下載'] },
    'en': { placeholder: 'Enter Highlights URL', subheading: 'Highlights', features: ['Story Highlights', 'Permanent Save', 'Batch Download'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="highlights" translations={t} acceptedTypes={['highlights']} />;
}
