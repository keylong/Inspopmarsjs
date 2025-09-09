import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import TermsClient from './terms-client';

interface TermsPageProps {
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
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  // 验证语言代码
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 动态导入对应语言的翻译
  const { default: t } = await import(`@/lib/i18n/locales/${locale}`);

  const canonicalUrl = `https://ins.popmars.com/${locale}/terms`;

  return {
    title: `${t.terms.title} | ${t.seo.siteName}`,
    description: t.terms.subtitle,
    keywords: [
      '使用条款',
      'Terms of Service',
      'Terms of Use',
      '利用規約',
      '서비스 이용약관',
      'Términos de Servicio',
      'Instagram下载器',
      'Instagram Downloader',
      '法律文件',
      'Legal Document',
      ...t.seo.keywords,
    ].join(', '),
    openGraph: {
      title: `${t.terms.title} | ${t.seo.siteName}`,
      description: t.terms.subtitle,
      siteName: t.seo.siteName,
      locale: locale,
      type: 'website',
      url: canonicalUrl,
      publishedTime: '2024-01-01T00:00:00Z',
      modifiedTime: '2024-09-09T00:00:00Z',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.terms.title} | ${t.seo.siteName}`,
      description: t.terms.subtitle,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-CN': '/zh-CN/terms',
        'zh-TW': '/zh-TW/terms',
        'en': '/en/terms',
        'ja': '/ja/terms',
        'ko': '/ko/terms',
        'es': '/es/terms',
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
    other: {
      // 结构化数据
      'application-ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t.terms.title,
          "description": t.terms.subtitle,
          "url": canonicalUrl,
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
            "@id": `${canonicalUrl}#article`,
            "headline": t.terms.title,
            "description": t.terms.subtitle,
            "datePublished": "2024-01-01T00:00:00Z",
            "dateModified": "2024-09-09T00:00:00Z",
            "author": {
              "@type": "Organization",
              "name": "InstagramDown Team"
            }
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "LegalDocument",
          "name": t.terms.title,
          "description": t.terms.subtitle,
          "url": canonicalUrl,
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
          }
        }
      ])
    }
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  
  // 验证语言代码
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 动态导入对应语言的翻译
  const { default: t } = await import(`@/lib/i18n/locales/${locale}`);

  // 准备翻译数据
  const translations = {
    title: t.terms.title,
    subtitle: t.terms.subtitle,
    lastUpdated: t.terms.lastUpdated,
    version: t.terms.version,
    tableOfContents: t.terms.tableOfContents,
    sections: t.terms.sections,
    effectiveDate: t.terms.effectiveDate,
    acknowledgment: t.terms.acknowledgment,
  };

  return (
    <>
      <TermsClient locale={locale as Locale} translations={translations} />
      
      {/* 结构化数据脚本 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": t.terms.title,
            "description": t.terms.subtitle,
            "url": `https://ins.popmars.com/${locale}/terms`,
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
              "headline": t.terms.title,
              "description": t.terms.subtitle,
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
            "name": t.terms.title,
            "description": t.terms.subtitle,
            "url": `https://ins.popmars.com/${locale}/terms`,
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
            }
          })
        }}
      />
    </>
  );
}