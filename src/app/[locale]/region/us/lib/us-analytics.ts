'use client';

// 美国市场专属分析追踪配置
export const US_ANALYTICS_CONFIG = {
  // Google Analytics 4 事件
  events: {
    // 页面浏览事件
    pageView: {
      name: 'page_view_us',
      parameters: {
        page_location: 'us_landing',
        page_title: 'US E-commerce Landing',
        user_type: 'us_visitor',
      },
    },
    
    // 下载事件
    download: {
      start: 'download_start_us',
      complete: 'download_complete_us',
      error: 'download_error_us',
    },
    
    // 转化事件
    conversion: {
      signup: 'signup_us',
      subscription: 'subscription_us',
      trial: 'trial_start_us',
    },
    
    // 用户互动事件
    engagement: {
      video_play: 'video_play_us',
      testimonial_view: 'testimonial_view_us',
      pricing_view: 'pricing_view_us',
      faq_expand: 'faq_expand_us',
    },
  },
  
  // 自定义维度
  dimensions: {
    user_country: 'US',
    user_language: 'en-US',
    traffic_source: 'organic',
    device_category: 'desktop',
    user_segment: 'ecommerce',
  },
  
  // 目标转化配置
  goals: {
    download: {
      id: 'us_download',
      value: 1,
      currency: 'USD',
    },
    signup: {
      id: 'us_signup',
      value: 5,
      currency: 'USD',
    },
    subscription: {
      id: 'us_subscription',
      value: 19,
      currency: 'USD',
    },
  },
};

// 追踪函数
export function trackUSEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      country: 'US',
      timestamp: new Date().toISOString(),
    });
  }
}

// 追踪页面浏览
export function trackUSPageView(pageName: string) {
  trackUSEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    user_region: 'US',
  });
}

// 追踪下载行为
export function trackUSDownload(contentType: string, success: boolean) {
  trackUSEvent(success ? 'download_success' : 'download_failed', {
    content_type: contentType,
    user_region: 'US',
    download_source: 'us_page',
  });
}

// 追踪用户注册
export function trackUSSignup(method: string) {
  trackUSEvent('sign_up', {
    method: method,
    user_region: 'US',
    signup_source: 'us_landing',
  });
}

// 追踪订阅购买
export function trackUSPurchase(plan: string, value: number) {
  trackUSEvent('purchase', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: plan,
      item_name: `${plan}_subscription`,
      item_category: 'subscription',
      item_variant: 'us',
      price: value,
      quantity: 1,
    }],
    user_region: 'US',
  });
}

// 追踪用户行为漏斗
export function trackUSFunnel(step: string, stepNumber: number) {
  trackUSEvent('funnel_progress', {
    funnel_name: 'us_conversion',
    funnel_step: step,
    funnel_step_number: stepNumber,
    user_region: 'US',
  });
}

// A/B测试追踪
export function trackUSExperiment(experimentId: string, variant: string) {
  trackUSEvent('experiment_impression', {
    experiment_id: experimentId,
    variant_id: variant,
    user_region: 'US',
  });
}

// 热力图数据收集
export function trackUSHeatmap(elementId: string, action: string, event?: MouseEvent) {
  trackUSEvent('heatmap_interaction', {
    element_id: elementId,
    action_type: action,
    page_section: 'us_landing',
    coordinates: {
      x: event?.clientX || 0,
      y: event?.clientY || 0,
    },
  });
}

// 性能监控
export function trackUSPerformance() {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    trackUSEvent('performance_metrics', {
      page_load_time: perfData.loadEventEnd - perfData.fetchStart,
      dom_ready_time: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      server_response_time: perfData.responseEnd - perfData.requestStart,
      user_region: 'US',
    });
  }
}

// 错误追踪
export function trackUSError(error: Error, context?: string) {
  trackUSEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    error_context: context || 'unknown',
    user_region: 'US',
    page_url: window.location.href,
  });
}

// 初始化美国市场分析
export function initUSAnalytics() {
  // 页面加载性能
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      trackUSPerformance();
    });
    
    // 错误捕获
    window.addEventListener('error', (event) => {
      trackUSError(new Error(event.message), 'window_error');
    });
    
    // 用户参与度追踪
    let engagementTime = 0;
    let lastActiveTime = Date.now();
    
    setInterval(() => {
      if (Date.now() - lastActiveTime < 30000) { // 30秒内有活动
        engagementTime += 10;
        trackUSEvent('user_engagement', {
          engagement_time_msec: 10000,
          user_region: 'US',
        });
      }
    }, 10000); // 每10秒检查一次
    
    // 追踪用户活动
    ['click', 'scroll', 'keypress'].forEach(eventType => {
      window.addEventListener(eventType, () => {
        lastActiveTime = Date.now();
      });
    });
  }
}

// 导出给 Google Tag Manager 使用的数据层
export function pushToDataLayer(data: Record<string, any>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      ...data,
      event_timestamp: Date.now(),
      user_region: 'US',
    });
  }
}

// 声明全局类型
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}