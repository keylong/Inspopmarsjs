# 监控和分析系统文档

## 概述

本项目集成了完整的监控和分析系统，包括：

- **Vercel Analytics**: 用户行为分析和页面性能监控
- **Sentry**: 错误追踪和性能监控
- **自定义监控**: 业务指标监控和实时仪表板
- **结构化日志**: 系统日志记录和分析

## 功能特性

### 1. 用户行为分析

- 页面浏览量统计
- 用户交互追踪
- 下载成功率监控
- 转化漏斗分析
- 自定义事件追踪

### 2. 错误监控

- 客户端错误自动捕获
- 服务器端异常追踪
- 全局错误边界处理
- 错误分类和统计
- 实时错误告警

### 3. 性能监控

- Core Web Vitals 监控
- API 响应时间追踪
- 资源加载性能分析
- 用户会话时长统计
- 自定义性能指标

### 4. 日志系统

- 分级日志记录 (DEBUG/INFO/WARN/ERROR/FATAL)
- 结构化日志格式
- 远程日志聚合
- 安全事件记录
- API 调用追踪

## 文件结构

```
src/
├── lib/
│   ├── analytics.ts          # 分析工具配置
│   └── logger.ts             # 日志记录工具
├── components/
│   ├── providers/
│   │   ├── analytics-provider.tsx  # 分析提供程序
│   │   └── error-boundary.tsx      # 错误边界组件
│   └── monitoring/
│       └── dashboard.tsx     # 监控仪表板
├── app/
│   ├── api/monitoring/       # 监控 API 路由
│   │   ├── stats/route.ts    # 统计数据 API
│   │   ├── errors/route.ts   # 错误报告 API
│   │   └── logs/route.ts     # 日志收集 API
│   ├── [locale]/
│   │   ├── monitoring/       # 监控仪表板页面
│   │   └── test-monitoring/  # 监控测试页面
│   └── global-error.tsx      # 全局错误处理
├── instrumentation.ts        # Sentry 服务器配置
└── instrumentation-client.ts # Sentry 客户端配置
```

## 配置说明

### 环境变量

```bash
# Sentry 配置
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token

# 禁用开发环境警告
SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1
SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING=1

# Vercel Analytics (自动启用)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=optional-id
```

### Sentry 配置

1. 在 [Sentry.io](https://sentry.io) 创建项目
2. 获取 DSN 和认证令牌
3. 配置环境变量
4. 在生产环境中启用源码映射

### Vercel Analytics

部署到 Vercel 时自动启用，无需额外配置。

## 使用方法

### 1. 追踪用户行为

```typescript
import { trackUserAction, trackDownload, trackConversion } from '@/lib/analytics';

// 追踪用户操作
trackUserAction('button_click', { page: 'home', button: 'download' });

// 追踪下载事件
trackDownload('image', 'instagram', true);

// 追踪转化事件
trackConversion('signup');
```

### 2. 错误处理

```typescript
import { useErrorHandler } from '@/components/providers/error-boundary';

function MyComponent() {
  const handleError = useErrorHandler();
  
  const handleClick = () => {
    try {
      // 可能出错的代码
      riskyOperation();
    } catch (error) {
      handleError(error, { context: 'button_click', userId: 'user123' });
    }
  };
}
```

### 3. 日志记录

```typescript
import logger from '@/lib/logger';

// 不同级别的日志
logger.debug('Debug information', { userId: '123' });
logger.info('User logged in', { userId: '123', method: 'google' });
logger.warn('Rate limit approaching', { userId: '123', remaining: 5 });
logger.error('Database connection failed', error, { query: 'SELECT *' });

// 专用日志方法
logger.apiCall('GET', '/api/users', 150, 200);
logger.userAction('download', { type: 'image', source: 'instagram' });
logger.performance('page_load', 1200);
logger.security('failed_login', { ip: '192.168.1.1', attempts: 3 });
```

### 4. 性能监控

```typescript
import { trackPerformance } from '@/lib/analytics';

// 手动性能测量
const start = performance.now();
await heavyOperation();
const duration = performance.now() - start;
trackPerformance('heavy_operation', duration);

// Core Web Vitals 自动收集
import { trackWebVitals } from '@/lib/analytics';
trackWebVitals(); // 在应用启动时调用
```

## 监控仪表板

访问 `/monitoring` 查看实时监控数据：

- 总下载量和成功率
- 平均响应时间
- 活跃用户数
- 错误统计
- Core Web Vitals 指标
- 服务状态

## API 端点

### 统计数据 API

```bash
GET /api/monitoring/stats?timeRange=24h
```

### 错误报告 API

```bash
POST /api/monitoring/errors
GET /api/monitoring/errors?limit=50&level=2
```

### 日志收集 API

```bash
POST /api/monitoring/logs
GET /api/monitoring/logs?level=2&category=api
```

## 测试

访问 `/test-monitoring` 页面测试所有监控功能：

- Analytics 事件追踪
- 错误捕获和报告
- 性能指标收集
- 日志记录
- API 调用监控

## 生产部署注意事项

### 1. 安全配置

- 确保 Sentry Auth Token 安全存储
- 配置适当的日志级别 (生产环境建议 INFO 及以上)
- 启用错误过滤，避免敏感信息泄露

### 2. 性能优化

- 调整 Sentry 采样率 (建议 10-20%)
- 限制日志记录频率
- 配置错误去重

### 3. 告警设置

- 配置 Sentry 告警规则
- 设置关键错误的实时通知
- 监控系统可用性

### 4. 数据保留

- 配置 Sentry 数据保留策略
- 定期清理本地日志存储
- 备份重要监控数据

## 故障排除

### 常见问题

1. **Sentry 未收到错误报告**
   - 检查 DSN 配置
   - 验证网络连接
   - 查看浏览器控制台错误

2. **Analytics 数据缺失**
   - 确认 Vercel Analytics 已启用
   - 检查事件追踪代码
   - 验证环境变量配置

3. **监控仪表板显示异常**
   - 检查 API 路由是否正常
   - 验证数据格式
   - 查看服务器日志

### 调试模式

开发环境中启用调试模式：

```bash
NODE_ENV=development
```

查看详细的错误信息和日志输出。

## 扩展功能

### 集成外部服务

- **DataDog**: APM 和基础设施监控
- **New Relic**: 应用性能监控
- **LogRocket**: 用户会话录制
- **Mixpanel**: 深度用户分析

### 自定义指标

```typescript
// 业务特定指标
trackCustomEvent({
  name: 'premium_feature_used',
  properties: {
    feature: 'bulk_download',
    plan: 'pro',
    userId: 'user123'
  }
});
```

## 更新日志

- **v1.0.0**: 基础监控系统实现
- **v1.1.0**: 添加 Sentry 集成
- **v1.2.0**: 增强错误边界和全局错误处理
- **v1.3.0**: 实现自定义监控仪表板

---

有关更多详细信息，请查看各个组件的代码注释和测试用例。