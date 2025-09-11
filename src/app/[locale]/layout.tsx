import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import { I18nProviderClient } from '@/lib/i18n/client';
import { locales, type Locale } from '@/lib/i18n/config';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { AnalyticsProvider } from '@/components/providers/analytics-provider';
import { ErrorBoundary } from '@/components/providers/error-boundary';
import { QueryProvider } from '@/components/providers/query-provider';
// import { AdSenseScript } from '@/components/ads/adsense-script';
import { PWAInstallPrompt } from '@/components/pwa/install-prompt';

// 使用增量静态再生 (ISR)
export const revalidate = 3600; // 每小时重新验证一次
export const dynamicParams = true;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // 优化字体加载
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // 优化字体加载
  preload: true,
});

interface LocaleLayoutProps {
  children: ReactNode;
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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 验证语言代码
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 动态导入对应语言的翻译
  const { default: t } = await import(`@/lib/i18n/locales/${locale}`);

  return {
    title: t.seo.defaultTitle,
    description: t.seo.defaultDescription,
    keywords: t.seo.keywords,
    openGraph: {
      title: t.seo.defaultTitle,
      description: t.seo.defaultDescription,
      siteName: t.seo.siteName,
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.seo.defaultTitle,
      description: t.seo.defaultDescription,
    },
    alternates: {
      languages: {
        'zh-CN': '/',
        'zh-TW': '/zh-TW',
        'en': '/en',
      },
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // 验证语言代码
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir="ltr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 预加载关键资源
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  document.querySelectorAll('[data-critical]').forEach(el => {
                    el.style.display = 'block';
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* <AdSenseScript /> */}
          <AnalyticsProvider>
            <ErrorBoundary>
              <QueryProvider>
                <I18nProviderClient locale={locale as Locale}>
                  <Navigation />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <PWAInstallPrompt />
                </I18nProviderClient>
              </QueryProvider>
            </ErrorBoundary>
          </AnalyticsProvider>
      </body>
    </html>
  );
}