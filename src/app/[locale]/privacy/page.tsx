import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import PrivacyPolicyClient from './privacy-client';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 生成静态参数
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  // 验证语言代码
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 动态导入对应语言的翻译
  const { default: t } = await import(`@/lib/i18n/locales/${locale}`);

  return {
    title: `${t.privacy.title} | ${t.seo.siteName}`,
    description: t.privacy.subtitle,
    keywords: [
      '隐私政策',
      'Privacy Policy',
      'プライバシーポリシー',
      'Política de Privacidad',
      '개인정보처리방침',
      'GDPR',
      'CCPA',
      '数据保护',
      'Data Protection',
      'Instagram下载器',
      'Instagram Downloader',
      '法律文件',
      'Legal Document',
      ...t.seo.keywords,
    ].join(', '),
    openGraph: {
      title: `${t.privacy.title} | ${t.seo.siteName}`,
      description: t.privacy.subtitle,
      siteName: t.seo.siteName,
      locale: locale,
      type: 'website',
      url: `/${locale}/privacy`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.privacy.title} | ${t.seo.siteName}`,
      description: t.privacy.subtitle,
    },
    alternates: {
      canonical: `https://ins.popmars.com/${locale}/privacy`,
      languages: {
        'zh-CN': '/zh-CN/privacy',
        'zh-TW': '/zh-TW/privacy', 
        'en': '/en/privacy',
        'ja': '/ja/privacy',
        'ko': '/ko/privacy',
        'es': '/es/privacy',
      },
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
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  
  // 验证语言代码
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 动态导入对应语言的翻译
  const { default: t } = await import(`@/lib/i18n/locales/${locale}`);

  return (
    <>
      <PrivacyPolicyClient locale={locale as Locale} />
      
      {/* 结构化数据脚本 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": t.privacy.title,
            "description": t.privacy.subtitle,
            "url": `https://ins.popmars.com/${locale}/privacy`,
            "datePublished": "2024-01-01T00:00:00Z",
            "dateModified": "2024-09-09T00:00:00Z",
            "inLanguage": locale,
            "isPartOf": {
              "@type": "WebSite",
              "name": t.seo.siteName,
              "url": "https://ins.popmars.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "InstagramDown",
              "url": "https://ins.popmars.com"
            },
            "mainEntity": {
              "@type": "Article",
              "headline": t.privacy.title,
              "description": t.privacy.subtitle,
              "datePublished": "2024-01-01T00:00:00Z",
              "dateModified": "2024-09-09T00:00:00Z",
              "author": {
                "@type": "Organization",
                "name": "InstagramDown Team"
              }
            }
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalDocument",
            "name": t.privacy.title,
            "description": t.privacy.subtitle,
            "url": `https://ins.popmars.com/${locale}/privacy`,
            "datePublished": "2024-01-01T00:00:00Z",
            "dateModified": "2024-09-09T00:00:00Z",
            "inLanguage": locale,
            "author": {
              "@type": "Organization",
              "name": "InstagramDown",
              "url": "https://ins.popmars.com"
            },
            "provider": {
              "@type": "Organization",
              "name": "InstagramDown", 
              "url": "https://ins.popmars.com"
            },
            "category": "Privacy Policy"
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PrivacyPolicy",
            "name": t.privacy.title,
            "description": t.privacy.subtitle,
            "url": `https://ins.popmars.com/${locale}/privacy`,
            "datePublished": "2024-01-01T00:00:00Z",
            "dateModified": "2024-09-09T00:00:00Z",
            "inLanguage": locale,
            "author": {
              "@type": "Organization",
              "name": "InstagramDown",
              "url": "https://ins.popmars.com"
            },
            "about": {
              "@type": "Organization",
              "name": "InstagramDown",
              "url": "https://ins.popmars.com"
            }
          })
        }}
      />
    </>
  );
}