'use client';

import { useEffect, useState, memo } from 'react';
import dynamic from 'next/dynamic';

// 延迟加载 Supabase 客户端
const getSupabase = () => import('@/lib/supabase').then(mod => mod.supabase);

interface AdSenseProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// 使用 memo 优化重渲染
export const AdSense = memo(function AdSense({
  slot = 'auto',
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdSenseProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 监听登录状态变化
    const setupSubscription = async () => {
      const supabase = await getSupabase();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });
      
      return subscription;
    };

    let subscription: any;
    setupSubscription().then(sub => {
      subscription = sub;
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    // 只有在非登录状态下才初始化广告
    if (!loading && !user && typeof window !== 'undefined') {
      try {
        // 等待 AdSense 脚本加载完成
        const initAd = () => {
          if (window.adsbygoogle) {
            window.adsbygoogle.push({});
            console.log('AdSense 广告已初始化');
          } else {
            // 如果脚本还没加载完，等待一下再试
            setTimeout(initAd, 100);
          }
        };
        initAd();
      } catch (error) {
        console.error('AdSense 初始化错误:', error);
      }
    }
  }, [loading, user]);

  // 如果正在加载或用户已登录，不显示广告
  if (loading || user) {
    return null;
  }

  // 只对非登录用户显示广告
  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3999079713100649"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
});

// 横幅广告组件
export function AdSenseBanner({ className = '' }: { className?: string }) {
  return (
    <AdSense
      slot="auto"
      format="horizontal"
      style={{ display: 'block', width: '100%', height: '90px' }}
      className={className}
    />
  );
}

// 矩形广告组件
export function AdSenseRectangle({ className = '' }: { className?: string }) {
  return (
    <AdSense
      slot="auto"
      format="rectangle"
      style={{ display: 'block', width: '300px', height: '250px' }}
      className={className}
    />
  );
}

// 响应式广告组件
export function AdSenseResponsive({ className = '' }: { className?: string }) {
  return (
    <AdSense
      slot="auto"
      format="auto"
      responsive={true}
      style={{ display: 'block' }}
      className={className}
    />
  );
}