/**
 * Analytics configuration and utilities
 * 分析工具配置和实用程序
 */

import { track } from '@vercel/analytics';

// 自定义事件类型定义
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

// 页面浏览事件
export const trackPageView = (page: string) => {
  track('pageview', { page });
};

// 下载事件追踪
export const trackDownload = (type: 'image' | 'video' | 'story', source: 'instagram' | 'tiktok', success: boolean) => {
  track('download', {
    type,
    source,
    success: success.toString(),
    timestamp: new Date().toISOString(),
  });
};

// 用户行为事件追踪
export const trackUserAction = (action: string, details?: Record<string, string | number | boolean>) => {
  track('user_action', {
    action,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

// 错误事件追踪
export const trackError = (error: string, context?: string) => {
  track('error', {
    error,
    context: context || 'unknown',
    timestamp: new Date().toISOString(),
  });
};

// 性能指标追踪
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  track('performance', {
    metric,
    value: value.toString(),
    unit,
    timestamp: new Date().toISOString(),
  });
};

// 转化事件追踪
export const trackConversion = (type: 'signup' | 'login' | 'premium_upgrade' | 'download_success') => {
  track('conversion', {
    type,
    timestamp: new Date().toISOString(),
  });
};

// 搜索事件追踪
export const trackSearch = (query: string, resultsCount: number) => {
  track('search', {
    query: query.substring(0, 50), // 限制查询长度保护隐私
    resultsCount: resultsCount.toString(),
    timestamp: new Date().toISOString(),
  });
};

// 通用事件追踪函数
export const trackCustomEvent = (event: AnalyticsEvent) => {
  track(event.name, {
    ...event.properties,
    timestamp: new Date().toISOString(),
  });
};

// 页面性能监控
export const trackWebVitals = () => {
  // 监控 Core Web Vitals
  if (typeof window !== 'undefined' && 'performance' in window) {
    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          trackPerformance('fcp', Math.round(entry.startTime));
        }
        
        // Largest Contentful Paint
        if (entry.entryType === 'largest-contentful-paint') {
          trackPerformance('lcp', Math.round(entry.startTime));
        }
        
        // Cumulative Layout Shift
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          trackPerformance('cls', Math.round((entry as any).value * 1000));
        }
        
        // First Input Delay
        if (entry.entryType === 'first-input') {
          const fid = Math.round(entry.processingStart - entry.startTime);
          trackPerformance('fid', fid);
        }
      }
    });
    
    // 观察相关的性能条目
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
  }
};

// 用户会话追踪
export const trackSession = () => {
  const sessionStart = Date.now();
  
  // 页面卸载时记录会话时长
  window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - sessionStart;
    trackPerformance('session_duration', sessionDuration);
  });
  
  // 记录会话开始
  trackCustomEvent({
    name: 'session_start',
    properties: {
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent.substring(0, 100),
    },
  });
};