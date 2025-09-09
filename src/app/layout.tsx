import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Instagram 下载软件 - 快速下载 Instagram 内容',
  description: '免费的 Instagram 下载工具，支持下载图片、视频、Stories 等多种内容格式，简单易用，安全可靠。',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 根布局只返回 children，html/body 标签由 [locale]/layout.tsx 处理
  return children;
}
