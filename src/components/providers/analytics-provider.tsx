'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect } from 'react';
import { trackWebVitals, trackSession } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // 初始化性能监控
    trackWebVitals();
    
    // 初始化会话追踪
    trackSession();
    
    // 页面可见性 API 监控
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面被隐藏时记录
        console.log('Page hidden');
      } else {
        // 页面重新可见时记录
        console.log('Page visible');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 在线状态监控
    const handleOnline = () => {
      console.log('User is online');
    };
    
    const handleOffline = () => {
      console.log('User is offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 清理事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <>
      {children}
      {/* Vercel Analytics */}
      <Analytics />
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </>
  );
}