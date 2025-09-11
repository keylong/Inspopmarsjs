/**
 * 性能优化配置文件
 * 包含所有 Lighthouse 优化相关的配置和最佳实践
 */

// 图片优化配置
export const imageConfig = {
  // 图片质量设置
  quality: 75,
  // 支持的格式
  formats: ['image/webp', 'image/avif'] as const,
  // 设备尺寸断点
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  // 图片尺寸
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // 最小缓存时间（秒）
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1年
};

// 动态导入配置 - 应该动态导入的组件
export const dynamicImports = {
  // 重型UI组件
  heavyComponents: [
    'framer-motion',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-select',
  ],
  // 分析和监控
  analytics: [
    '@vercel/analytics',
    '@vercel/speed-insights',
    '@sentry/nextjs',
  ],
  // 第三方库
  thirdParty: [
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
  ],
};

// 脚本加载策略
export const scriptStrategy = {
  // 立即加载（关键脚本）
  beforeInteractive: [],
  // 页面交互后加载（非关键脚本）
  afterInteractive: [
    'google-analytics',
    'google-adsense',
    'facebook-pixel',
  ],
  // 空闲时加载（低优先级脚本）
  lazyOnload: [
    'chat-widget',
    'feedback-widget',
  ],
  // Worker 中加载
  worker: [
    'heavy-computation',
    'image-processing',
  ],
};

// 预连接和预获取配置
export const resourceHints = {
  // DNS 预获取
  dnsPrefetch: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  // 预连接
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net',
  ],
  // 预加载关键资源
  preload: [
    {
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ],
};

// 缓存策略配置
export const cacheStrategies = {
  // 静态资源（永久缓存）
  static: {
    maxAge: 31536000, // 1年
    immutable: true,
  },
  // API 响应
  api: {
    maxAge: 60, // 1分钟
    sMaxAge: 300, // CDN 5分钟
    staleWhileRevalidate: 600, // 10分钟
  },
  // 页面
  pages: {
    maxAge: 300, // 5分钟
    sMaxAge: 3600, // CDN 1小时
    staleWhileRevalidate: 86400, // 1天
  },
};

// Web Vitals 目标值
export const webVitalsTargets = {
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800, // < 1.8s
    needsImprovement: 3000, // 1.8s - 3s
  },
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500, // < 2.5s
    needsImprovement: 4000, // 2.5s - 4s
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1, // < 0.1
    needsImprovement: 0.25, // 0.1 - 0.25
  },
  // First Input Delay (FID)
  FID: {
    good: 100, // < 100ms
    needsImprovement: 300, // 100ms - 300ms
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200, // < 200ms
    needsImprovement: 500, // 200ms - 500ms
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800, // < 0.8s
    needsImprovement: 1800, // 0.8s - 1.8s
  },
};

// 优化建议检查清单
export const optimizationChecklist = {
  images: [
    '使用 next/image 组件替代 <img> 标签',
    '设置合适的图片尺寸和响应式断点',
    '启用 WebP 和 AVIF 格式',
    '使用懒加载和优先级提示',
  ],
  fonts: [
    '使用 next/font 加载字体',
    '设置 font-display: swap',
    '预加载关键字体文件',
    '使用可变字体减少文件数量',
  ],
  scripts: [
    '使用 next/script 加载第三方脚本',
    '设置合适的加载策略（afterInteractive/lazyOnload）',
    '移除未使用的 JavaScript',
    '延迟加载非关键脚本',
  ],
  css: [
    '移除未使用的 CSS',
    '内联关键 CSS',
    '使用 CSS-in-JS 或 CSS Modules',
    '启用 Tailwind CSS 的 purge 功能',
  ],
  performance: [
    '启用 Gzip/Brotli 压缩',
    '设置合适的缓存策略',
    '使用 CDN 加速静态资源',
    '启用 HTTP/2 或 HTTP/3',
  ],
};

// Vercel Speed Insights 已经处理了 Web Vitals 监控
// 不需要额外的监控函数