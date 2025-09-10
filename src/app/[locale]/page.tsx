import { Metadata } from 'next';
import { HomeContent } from './home-content';
import { locales, type Locale } from '@/lib/i18n/config';

// 生成静态参数
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  // 动态导入对应语言的翻译
  const { default: t } = await import(`@/lib/i18n/locales/${locale}`);

  return {
    title: t.seo.homeTitle || t.seo.defaultTitle,
    description: t.seo.homeDescription || t.seo.defaultDescription,
    keywords: t.seo.keywords,
    openGraph: {
      title: t.seo.homeTitle || t.seo.defaultTitle,
      description: t.seo.homeDescription || t.seo.defaultDescription,
      images: ['/og-image.svg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.seo.homeTitle || t.seo.defaultTitle,
      description: t.seo.homeDescription || t.seo.defaultDescription,
      images: ['/og-image.svg'],
    },
  };
}

export default function HomePage() {
  return <HomeContent />;
}