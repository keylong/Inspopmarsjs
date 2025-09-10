'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Script from 'next/script';

export function AdSenseScript() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log('AdSense 脚本加载检查:', user ? '已登录 - 不加载脚本' : '未登录 - 加载脚本');
      } catch (error) {
        console.error('Error checking user for AdSense script:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      console.log('AdSense 脚本状态变化:', event, session?.user ? '已登录 - 移除脚本' : '未登录 - 加载脚本');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 如果正在加载或用户已登录，不加载 AdSense 脚本
  if (loading || user) {
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