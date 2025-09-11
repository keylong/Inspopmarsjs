/**
 * Lighthouse CI 配置文件
 * 用于自动化性能评分和监控
 */

module.exports = {
  ci: {
    collect: {
      // 测试的 URL
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/download/post',
        'http://localhost:3000/download/reels',
        'http://localhost:3000/download/story',
      ],
      // 每个 URL 运行的次数
      numberOfRuns: 3,
      // 启动服务器的命令
      startServerCommand: 'npm run start',
      // 等待服务器启动的时间
      startServerReadyPattern: 'ready on',
      // Chrome 设置
      settings: {
        // 模拟设备
        emulatedFormFactor: 'mobile',
        // 节流设置（模拟 3G 网络）
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },
        // 跳过的审计项
        skipAudits: [
          'uses-http2', // 本地开发不支持 HTTP/2
          'canonical', // 可选的 SEO 审计
        ],
        // 只运行特定类别
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
          'pwa',
        ],
      },
    },
    assert: {
      // 预设配置
      preset: 'lighthouse:recommended',
      // 自定义断言
      assertions: {
        // 性能分数要求
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        'categories:pwa': ['warn', { minScore: 0.80 }],
        
        // 核心 Web 指标
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 4000 }],
        
        // 资源优化
        'uses-webp-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'error',
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        
        // JavaScript 优化
        'unused-javascript': ['warn', { maxLength: 2 }],
        'render-blocking-resources': ['warn', { maxLength: 2 }],
        'unminified-javascript': 'error',
        'unused-css-rules': 'warn',
        
        // 缓存策略
        'uses-long-cache-ttl': 'warn',
        'efficient-animated-content': 'warn',
        
        // 辅助功能
        'color-contrast': 'error',
        'heading-order': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        
        // PWA 要求
        'service-worker': 'warn',
        'installable-manifest': 'warn',
        'apple-touch-icon': 'warn',
        'themed-omnibox': 'warn',
        'maskable-icon': 'warn',
        
        // 允许的警告
        'csp-xss': 'off', // 内容安全策略（可选）
        'non-composited-animations': 'off', // 动画优化（可选）
      },
    },
    upload: {
      // 本地存储报告
      target: 'filesystem',
      outputDir: './lighthouse-reports',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
    server: {
      // 本地服务器配置
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDatabasePath: './lighthouse-ci.db',
      },
    },
  },
};