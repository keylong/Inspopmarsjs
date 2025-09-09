'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

// Web Vitals 阈值
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needs_improvement: 0.25 },
  FCP: { good: 1800, needs_improvement: 3000 },
  LCP: { good: 2500, needs_improvement: 4000 },
  TTFB: { good: 800, needs_improvement: 1800 },
};

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

function sendToAnalytics(metric: VitalMetric) {
  // 发送到 Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.rating,
      custom_parameter_3: metric.id,
    });
  }

  // 发送到 Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('track', 'Web Vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }

  // 发送到自定义分析端点
  if (process.env.NODE_ENV === 'production') {
    navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }));
  }

  // 开发环境下打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
  }
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needs_improvement) return 'needs-improvement';
  return 'poor';
}

export function WebVitalsReporter() {
  useEffect(() => {
    // 暂时禁用 Web Vitals 监控，专注于功能测试
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals] 开发环境下已禁用监控');
      return;
    }

    try {
      // 只在生产环境启用监控
      onCLS((metric) => {
        sendToAnalytics({
          name: 'CLS',
          value: metric.value,
          rating: getRating('CLS', metric.value),
          delta: metric.delta,
          id: metric.id,
        });
      });

      onFCP((metric) => {
        sendToAnalytics({
          name: 'FCP',
          value: metric.value,
          rating: getRating('FCP', metric.value),
          delta: metric.delta,
          id: metric.id,
        });
      });

      onLCP((metric) => {
        sendToAnalytics({
          name: 'LCP',
          value: metric.value,
          rating: getRating('LCP', metric.value),
          delta: metric.delta,
          id: metric.id,
        });
      });

      onTTFB((metric) => {
        sendToAnalytics({
          name: 'TTFB',
          value: metric.value,
          rating: getRating('TTFB', metric.value),
          delta: metric.delta,
          id: metric.id,
        });
      });
    } catch (error) {
      console.error('[Web Vitals] 监控初始化失败:', error);
    }
  }, []);

  return null;
}

// 性能优化工具函数
export class PerformanceOptimizer {
  /**
   * 预加载关键资源
   */
  static preloadCriticalResources() {
    if (typeof window === 'undefined') return;

    // 预加载关键字体
    const fontPreloads = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-display.woff2',
    ];

    fontPreloads.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // 预连接到关键第三方域名
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdninstagram.com',
      'https://fbcdn.net',
    ];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  /**
   * 优化图像加载
   */
  static optimizeImageLoading() {
    if (typeof window === 'undefined') return;

    // 为所有图片添加 loading="lazy" (如果还没有)
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      (img as HTMLImageElement).loading = 'lazy';
    });

    // 添加图片解码优化
    const criticalImages = document.querySelectorAll('img[data-critical="true"]');
    criticalImages.forEach((img) => {
      (img as HTMLImageElement).decoding = 'sync';
      (img as HTMLImageElement).loading = 'eager';
    });
  }

  /**
   * 减少布局偏移
   */
  static reduceLayoutShift() {
    if (typeof window === 'undefined') return;

    // 为没有尺寸的图片设置占位尺寸
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach((img) => {
      const element = img as HTMLImageElement;
      if (element.naturalWidth && element.naturalHeight) {
        element.setAttribute('width', element.naturalWidth.toString());
        element.setAttribute('height', element.naturalHeight.toString());
      }
    });

    // 添加骨架屏样式类
    const skeletonElements = document.querySelectorAll('[data-skeleton]');
    skeletonElements.forEach((el) => {
      el.classList.add('animate-pulse');
    });
  }

  /**
   * 优化第三方脚本
   */
  static optimizeThirdPartyScripts() {
    if (typeof window === 'undefined') return;

    // 延迟加载非关键的第三方脚本
    const deferredScripts = [
      'https://www.googletagmanager.com/gtag/js',
      'https://static.hotjar.com/c/hotjar-',
    ];

    // 在页面空闲时加载
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        deferredScripts.forEach((src) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        });
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        deferredScripts.forEach((src) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        });
      }, 2000);
    }
  }

  /**
   * 初始化所有性能优化
   */
  static init() {
    if (typeof window === 'undefined') return;

    // 在 DOM 准备就绪时运行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.preloadCriticalResources();
        this.optimizeImageLoading();
        this.reduceLayoutShift();
        this.optimizeThirdPartyScripts();
      });
    } else {
      this.preloadCriticalResources();
      this.optimizeImageLoading();
      this.reduceLayoutShift();
      this.optimizeThirdPartyScripts();
    }
  }
}

// Resource Hints 组件
export function ResourceHints() {
  return (
    <>
      {/* DNS 预解析 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdninstagram.com" />
      <link rel="dns-prefetch" href="//fbcdn.net" />
      
      {/* 预连接关键资源 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* 预加载关键CSS */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
      
      {/* 预取下一页可能用到的资源 */}
      <link rel="prefetch" href="/api/download" />
    </>
  );
}