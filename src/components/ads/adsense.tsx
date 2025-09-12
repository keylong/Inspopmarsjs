'use client';

import { useEffect, memo } from 'react';
import { useAuth } from '@/lib/auth-context';

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
  // 使用全局的 AuthContext，避免重复请求
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // 只有在非登录状态下才初始化广告
    if (!isLoading && !user && typeof window !== 'undefined') {
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
  }, [isLoading, user]);

  // 如果正在加载或用户已登录，不显示广告
  if (isLoading || user) {
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