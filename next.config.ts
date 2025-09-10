// import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        }
      }
    },
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-jsdelivr',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        }
      }
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /^https:\/\/www\.instagram\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'instagram-api',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 5 // 5 minutes
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5 // 5 minutes
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 // 1 hour
        },
        networkTimeoutSeconds: 10
      }
    }
  ]
});

const nextConfig: NextConfig = {
  /* i18n configuration */
  outputFileTracingRoot: process.cwd(),
  
  // CDN 和静态资源配置
  assetPrefix: process.env.CDN_URL || '',
  
  // 输出配置
  // output: 'standalone', // 暂时禁用以避免构建问题
  
  // 压缩配置
  compress: true,
  
  // ESLint 配置 - 临时忽略构建时的 ESLint 错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'instagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  
  // Performance optimizations and features
  experimental: {
    // Enable Web Vitals attribution
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
    
    // Optimize package imports for better tree shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
    ],
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        // 静态资源缓存
        source: '/(.*?)\\.(js|css|woff|woff2|png|jpg|jpeg|gif|svg|ico|webp|avif)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API 路由缓存控制
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        // 页面缓存
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
          },
          // 安全头
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Webpack optimization for code splitting
  webpack: (config, { dev, isServer }) => {
    // 忽略 Prisma instrumentation 警告
    config.ignoreWarnings = [
      {
        module: /@prisma\/instrumentation/,
      },
      {
        module: /@opentelemetry\/instrumentation/,
      },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    
    // Only apply in production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Common chunks for frequently used components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
            // UI components chunk
            ui: {
              test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    
    // 为服务端添加 polyfill，修复 'self is not defined' 错误
    if (isServer) {
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.fallback) {
        config.resolve.fallback = {};
      }
      
      // 添加 Node.js polyfill
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      
      // 定义 self 为 global
      config.plugins = config.plugins || [];
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.DefinePlugin({
          'self': 'global',
        })
      );
    }
    
    return config;
  },
}

// Sentry webpack plugin options - 暂时禁用
// const sentryWebpackPluginOptions = {
//   // Additional config options for the Sentry webpack plugin. Keep in mind that
//   // the following options are set automatically, and overriding them is not
//   // recommended:
//   //   release, url, configFile, stripPrefix, urlPrefix, include, ignore
//   
//   org: process.env.SENTRY_ORG,
//   project: process.env.SENTRY_PROJECT,
//   
//   // Only print logs for uploading source maps in CI
//   silent: !process.env.CI,
//   
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options.
// }

// Make sure adding Sentry options is the last code to run before exporting
// 临时禁用 Sentry 以解决类型错误
// export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
export default withPWA(nextConfig);
