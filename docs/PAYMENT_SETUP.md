# 支付系统集成指南

## 概览

本项目集成了 Stripe 和支付宝两种支付方式，支持订阅制会员服务。用户可以购买不同的订阅套餐来获取下载权限。

## 功能特性

- ✅ Stripe 信用卡支付
- ✅ 支付宝支付
- ✅ 订阅管理（月付、年付、终身）
- ✅ Webhook 回调处理
- ✅ 自动发票生成
- ✅ 使用量跟踪
- ✅ 订阅状态管理

## 环境配置

### 1. Stripe 配置

1. 在 [Stripe Dashboard](https://dashboard.stripe.com) 创建账户
2. 获取API密钥：
   - 测试环境：`pk_test_...` 和 `sk_test_...`
   - 生产环境：`pk_live_...` 和 `sk_live_...`
3. 配置 Webhook：
   - URL: `https://your-domain.com/api/payment/webhook/stripe`
   - 监听事件：
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### 2. 支付宝配置

1. 在 [支付宝开放平台](https://openhome.alipay.com) 创建应用
2. 获取应用信息：
   - App ID
   - 应用私钥
   - 支付宝公钥
3. 配置回调地址：
   - 异步通知：`https://your-domain.com/api/payment/webhook/alipay`
   - 同步跳转：`https://your-domain.com/subscription/success`

### 3. 环境变量设置

在 `.env.local` 文件中设置以下环境变量：

```bash
# Stripe 配置
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# 支付宝配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_here
-----END PRIVATE KEY-----"
ALIPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
alipay_public_key_here
-----END PUBLIC KEY-----"
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do
ALIPAY_NOTIFY_URL=https://your-domain.com/api/payment/webhook/alipay
ALIPAY_RETURN_URL=https://your-domain.com/subscription/success

# NextAuth 配置（必需）
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-jwt-token-here-min-32-chars-long
```

## 订阅套餐配置

系统预设了三种订阅套餐，可以在 `/src/lib/payment-db.ts` 中修改：

1. **基础月度套餐** ($9.99/月)
   - 每月100次下载
   - 标准画质
   
2. **专业月度套餐** ($19.99/月)
   - 每月500次下载
   - 高清画质
   - 批量下载
   
3. **无限月度套餐** ($39.99/月)
   - 无限下载
   - 最高画质
   - API访问

## API 接口

### 获取订阅套餐

```http
GET /api/payment/plans
```

### 获取用户订阅信息

```http
GET /api/payment/subscription
Authorization: Bearer <session-token>
```

### 创建支付会话

```http
POST /api/payment/checkout
Content-Type: application/json

{
  "planId": "basic-monthly",
  "paymentMethod": "stripe", // 或 "alipay"
  "returnUrl": "https://your-domain.com/custom-success-page" // 可选
}
```

### 获取用户发票

```http
GET /api/invoices
Authorization: Bearer <session-token>
```

### 下载发票PDF

```http
GET /api/invoices/{invoiceId}/download
Authorization: Bearer <session-token>
```

## 前端页面

### 订阅管理页面

访问 `/subscription` 查看当前订阅状态和升级选项。

### 支付成功页面

用户支付成功后会跳转到 `/subscription/success`。

### 支付取消页面

用户取消支付后会跳转到 `/subscription/cancel`。

## 数据结构

### 订阅套餐 (SubscriptionPlan)
```typescript
{
  id: string
  name: string
  price: number
  currency: 'USD' | 'CNY'
  duration: 'monthly' | 'yearly' | 'lifetime'
  features: string[]
  downloadLimit: number // -1 表示无限制
  isActive: boolean
}
```

### 用户订阅 (UserSubscription)
```typescript
{
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'expired' | 'pending'
  paymentMethod: 'stripe' | 'alipay'
  currentPeriodStart: string
  currentPeriodEnd: string
  downloadCount: number
}
```

### 支付订单 (PaymentOrder)
```typescript
{
  id: string
  userId: string
  planId: string
  amount: number
  currency: 'USD' | 'CNY'
  paymentMethod: 'stripe' | 'alipay'
  status: 'pending' | 'paid' | 'failed' | 'canceled'
}
```

## 使用量控制

在下载功能中集成使用量控制：

```typescript
import { incrementDownloadCount } from '@/lib/payment-db'

export async function downloadContent(userId: string, url: string) {
  // 检查并增加使用次数
  const result = await incrementDownloadCount(userId)
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  // 执行下载逻辑
  // ...
  
  return { success: true, remainingDownloads: result.remainingDownloads }
}
```

## 测试

### Stripe 测试卡号

- 成功支付：`4242424242424242`
- 需要验证：`4000000000003220`
- 支付失败：`4000000000000002`

### 支付宝沙箱

使用支付宝提供的沙箱环境进行测试。

## 部署注意事项

1. **SSL证书**：生产环境必须使用HTTPS
2. **Webhook安全**：验证Webhook签名
3. **错误处理**：记录所有支付错误日志
4. **数据备份**：定期备份用户订阅和支付数据
5. **监控告警**：监控支付成功率和错误率

## 故障排除

### 常见问题

1. **Stripe Webhook 验证失败**
   - 检查 `STRIPE_WEBHOOK_SECRET` 是否正确
   - 确保请求体是原始格式（未解析的JSON）

2. **支付宝签名验证失败**
   - 检查私钥格式是否正确
   - 确保公钥是支付宝公钥，不是应用公钥

3. **订阅状态异常**
   - 检查Webhook是否正常接收
   - 查看服务器日志定位问题

### 日志查看

支付相关的日志会输出到控制台，生产环境建议集成日志服务如 Sentry。

## 安全注意事项

- 永远不要在前端暴露 `STRIPE_SECRET_KEY` 或 `ALIPAY_PRIVATE_KEY`
- 使用 HTTPS 保护所有支付相关的API
- 验证所有Webhook签名
- 定期轮换API密钥
- 监控异常支付行为

## 支持

如有问题，请：
1. 检查环境变量配置
2. 查看服务器日志
3. 验证Webhook配置
4. 联系开发团队