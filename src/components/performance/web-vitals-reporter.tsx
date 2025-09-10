'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export function WebVitalsReporter() {
  useEffect(() => {
    // 报告 Web Vitals 指标
    function sendToAnalytics(metric: any) {
      // 可以将指标发送到分析服务
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vitals:', metric);
      }
      
      // 发送到 Google Analytics 或其他分析服务
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    }

    // 注册所有 Web Vitals 回调
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onINP(sendToAnalytics); // INP 已经替代了 FID
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}