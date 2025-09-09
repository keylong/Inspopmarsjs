# 部署指南

## 概述

本文档提供了 Instagram 下载器项目的完整部署指南，包括 Vercel 部署配置、环境变量设置、DNS 配置和流量切换策略。

## 快速开始

### 1. 环境准备

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 安装项目依赖
npm install
```

### 2. 环境变量配置

复制并配置环境变量：

```bash
# 复制环境变量模板
cp .env.example .env.local
cp .env.production .env.production.local

# 编辑环境变量
# 填入实际的 API 密钥和配置
```

### 3. 部署到预览环境

```bash
# 部署预览版本
vercel

# 运行健康检查
curl https://your-preview-url.vercel.app/api/health
```

### 4. 部署到生产环境

```bash
# 使用部署脚本
./scripts/deploy.sh

# 或手动部署
vercel --prod
```

## 部署配置文件

### Vercel 配置 (`vercel.json`)

- **功能**: 服务器函数超时设置
- **头部**: 安全头和缓存策略
- **重定向**: WWW 到非 WWW 重定向
- **重写**: SEO 友好的 URL
- **定时任务**: 清理和分析任务

### GitHub Actions (`.github/workflows/deploy.yml`)

- **质量检查**: 代码检查、测试、构建验证
- **预览部署**: 自动部署到预览环境
- **生产部署**: 经过审批的生产环境部署
- **回滚支持**: 一键回滚到上一个版本

## 灰度发布

### 金丝雀部署

```bash
# 部署金丝雀版本 (10% 流量)
./scripts/canary-deploy.sh 10

# 监控 5 分钟后决定是否推广
# 推广到 50% 流量
./scripts/canary-deploy.sh 50

# 推广到 100% 流量
./scripts/canary-deploy.sh 100
```

### 流量监控

```bash
# 启动流量监控
./scripts/traffic-monitor.sh monitor

# 验证流量切换
./scripts/traffic-monitor.sh verify

# 生成监控报告
./scripts/traffic-monitor.sh report
```

## DNS 配置

### 1. 主域名记录

```dns
# A 记录或 CNAME
ins.popmars.com  →  cname.vercel-dns.com
www.ins.popmars.com  →  cname.vercel-dns.com
```

### 2. SSL 证书

- Vercel 自动颁发 Let's Encrypt 证书
- 支持自动续期
- 包含主域名和 WWW 子域名

### 3. 验证配置

```bash
# 检查 DNS 解析
dig ins.popmars.com
dig www.ins.popmars.com

# 检查 SSL 证书
openssl s_client -connect ins.popmars.com:443 -servername ins.popmars.com
```

## 环境变量

### 必需变量

```bash
# 基础配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://ins.popmars.com

# API 配置
INSTAGRAM_SESSION_ID=your_session_id
INSTAGRAM_CSRF_TOKEN=your_csrf_token

# 安全配置
JWT_SECRET=your_jwt_secret
CRON_SECRET=your_cron_secret
```

### 可选变量

```bash
# 分析追踪
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=BAIDU_ANALYTICS_ID

# 错误监控
SENTRY_DSN=your_sentry_dsn

# 支付配置
ALIPAY_APP_ID=your_alipay_app_id
WECHAT_PAY_MERCHANT_ID=your_wechat_merchant_id
```

## 监控和告警

### 健康检查端点

- **主健康检查**: `/api/health`
- **详细状态**: 包含服务状态和性能指标
- **监控集成**: 支持 Pingdom、StatusCake 等

### 自动化监控

```bash
# 设置环境变量启用告警
export SLACK_WEBHOOK_URL="your_slack_webhook"
export ALERT_EMAIL="admin@popmars.com"
export AUTO_ROLLBACK="true"

# 启动监控
./scripts/traffic-monitor.sh monitor
```

### 监控指标

- **可用性**: 服务健康状态
- **性能**: 响应时间和吞吐量
- **错误率**: 4xx/5xx 错误统计
- **业务指标**: 下载次数、用户活跃度

## 故障排除

### 常见问题

1. **部署失败**
   ```bash
   # 检查构建日志
   vercel logs deployment_id
   
   # 验证环境变量
   vercel env ls
   ```

2. **DNS 问题**
   ```bash
   # 检查 DNS 传播
   dig +trace ins.popmars.com
   
   # 检查 Vercel 域名状态
   vercel domains inspect ins.popmars.com
   ```

3. **SSL 证书问题**
   ```bash
   # 检查证书状态
   vercel certs ls
   
   # 强制更新证书
   vercel certs renew ins.popmars.com
   ```

### 紧急回滚

```bash
# 方法 1: 使用 GitHub Actions
# 在 GitHub 仓库中触发 "rollback" 工作流

# 方法 2: 使用 Vercel CLI
vercel ls  # 查看部署历史
vercel promote deployment_id  # 推广之前的部署

# 方法 3: 使用部署脚本
DEPLOYMENT_TYPE=rollback ./scripts/deploy.sh
```

## 性能优化

### 构建优化

- **代码分割**: 动态导入和路由级分割
- **树摇优化**: 移除未使用的代码
- **图片优化**: Next.js Image 组件
- **字体优化**: 字体显示策略

### 缓存策略

- **静态资源**: 1年缓存 + 不可变标记
- **API 响应**: 基于内容的缓存策略
- **CDN 配置**: 全球边缘缓存

### 监控优化

- **Core Web Vitals**: 页面性能指标
- **Bundle 分析**: 打包大小监控
- **运行时性能**: 内存和 CPU 使用率

## 安全配置

### 安全头

```javascript
// 在 vercel.json 中已配置
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### API 安全

- **速率限制**: 防止 API 滥用
- **CORS 策略**: 跨域请求控制
- **身份验证**: JWT 令牌验证
- **输入验证**: 数据清理和验证

## 维护和更新

### 定期维护

- **依赖更新**: 每月检查安全更新
- **证书续期**: 自动化，但需监控
- **日志清理**: 定时清理旧日志文件
- **性能监控**: 持续监控和优化

### 更新流程

1. **功能开发**: 在功能分支开发
2. **代码审查**: 团队代码审查
3. **测试验证**: 自动化测试通过
4. **预览部署**: 部署到预览环境
5. **灰度发布**: 逐步推广到生产环境
6. **监控验证**: 确保稳定性
7. **完整部署**: 100% 流量切换

## 联系信息

- **技术支持**: tech@popmars.com
- **紧急联系**: +86-xxx-xxxx-xxxx
- **文档更新**: 请提交 PR 到 GitHub 仓库

---

最后更新: 2025-09-09  
版本: 1.0.0