import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'profile');
}

export default async function ProfileDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '输入Instagram用户名...', subheading: '头像下载', features: ['高清头像', '原始尺寸', '快速获取'] },
    'zh-TW': { placeholder: '輸入Instagram用戶名...', subheading: '頭像下載', features: ['高清頭像', '原始尺寸', '快速獲取'] },
    'en': { placeholder: 'Enter Instagram username...', subheading: 'Profile Download', features: ['HD Avatar', 'Original Size', 'Quick Access'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="profile" translations={t} acceptedTypes={['profile']} />;
}
