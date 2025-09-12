import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Geist, Geist_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';
import { ToastContainer } from '@/components/download/toast-container';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

// 优化字体加载 - 使用 next/font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// 使用增量静态再生 (ISR)
export const revalidate = 3600; // 每小时重新验证一次

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'InstaDownPro - Instagram 视频图片下载器',
  description: '免费的 Instagram 下载工具，支持下载图片、视频、Stories 等多种内容格式，简单易用，安全可靠。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ins下载器',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'InstaDownPro - Instagram 视频图片下载器',
    description: '免费下载 Instagram 照片、视频、Reels 和 Stories',
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaDownPro - Instagram 视频图片下载器',
    description: '免费下载 Instagram 照片、视频、Reels 和 Stories',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}>
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
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased flex flex-col`}>
        <AuthProvider>
          {children}
          <Toaster />
          <ToastContainer />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
