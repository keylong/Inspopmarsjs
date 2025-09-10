import { Metadata } from 'next';
import DownloadPageWrapper, { generateDownloadPageMetadata } from '@/components/download/download-page-wrapper';
import { locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateDownloadPageMetadata(locale, 'private');
}

export default async function PrivateDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = {
    'zh-CN': { placeholder: '请输入私人账号链接', subheading: '私人内容', features: ['私人内容', '授权访问', '安全下载'] },
    'zh-TW': { placeholder: '請輸入私人帳號連結', subheading: '私人內容', features: ['私人內容', '授權訪問', '安全下載'] },
    'en': { placeholder: 'Enter private account URL', subheading: 'Private Content', features: ['Private Content', 'Authorized Access', 'Secure Download'] },
  };
  const t = translations[locale as keyof typeof translations] || translations['zh-CN'];
  return <DownloadPageWrapper locale={locale} contentType="private" translations={t} acceptedTypes={['private']} requireAuth={true} />;
}
