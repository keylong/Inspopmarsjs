import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'stories');
}

export default async function StoriesDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入用户名或 Stories 链接', subheading: '限时动态', features: ['24小时内容', '匿名查看', '批量保存'] },
    'zh-TW': { placeholder: '請輸入用戶名或 Stories 連結', subheading: '限時動態', features: ['24小時內容', '匿名查看', '批量保存'] },
    'en': { placeholder: 'Enter username or Stories URL', subheading: 'Stories', features: ['24-hour Content', 'Anonymous View', 'Batch Save'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="stories" translations={t} acceptedTypes={['stories']} />;
}
