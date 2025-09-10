import { ReactNode } from 'react';
import { Metadata } from 'next';
import './globals.css';

// 强制所有页面使用动态渲染
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'InstaDownPro - Instagram 视频图片下载器',
  description: '免费的 Instagram 下载工具，支持下载图片、视频、Stories 等多种内容格式，简单易用，安全可靠。',
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ins下载器',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
