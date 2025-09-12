'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Script from 'next/script';

export function AdSenseScript() {
  // 使用全局的 AuthContext，避免重复请求
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // 只在状态改变时打印日志
    if (!isLoading) {
      console.log('AdSense 脚本加载检查:', user ? '已登录 - 不加载脚本' : '未登录 - 加载脚本');
    }
  }, [isLoading, user]);

  // 如果正在加载或用户已登录，不加载 AdSense 脚本
  if (isLoading || user) {
    return null;
  }

  // 只对非登录用户加载 AdSense 脚本
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3999079713100649"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('AdSense 脚本已加载 - 用户未登录');
      }}
      onError={() => {
        console.error('AdSense 脚本加载失败');
      }}
    />
  );
}