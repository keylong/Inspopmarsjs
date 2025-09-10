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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.svg',
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
