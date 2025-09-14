# 支付网关集成设置指南

## 概述

本项目已成功集成了智能支付网关 (https://pay.chats2gpt.com/)，支持微信支付和支付宝收款。

## 集成的功能

- ✅ 支付网关API接口封装
- ✅ 订单创建功能
- ✅ 支付回调处理
- ✅ 智能签名验证
- ✅ 支付状态轮询
- ✅ 订阅界面集成
- ✅ 用户权益自动激活

## 环境配置

### 1. 环境变量设置

在 `.env.local` 文件中添加以下配置：

```bash
# 支付网关配置
PAYMENT_GATEWAY_URL=https://pay.chats2gpt.com
PAYMENT_GATEWAY_API_KEY=你的API密钥
PAYMENT_GATEWAY_CALLBACK_URL=https://你的域名.com/api/payment/gateway-callback
```

### 2. 支付网关配置

访问支付网关管理界面，设置：
- API密钥：用于签名验证
- 回调地址：`https://你的域名.com/api/payment/gateway-callback`

## 文件结构

```
src/
├── lib/
│   ├── payment-gateway.ts          # 支付网关核心功能
│   └── payment-db.ts              # 数据库操作 (已扩展)
├── app/api/payment/
│   ├── gateway-order/route.ts      # 创建支付订单API
│   ├── gateway-callback/route.ts   # 支付回调处理API
│   └── order-status/[orderId]/route.ts  # 订单状态查询API
├── components/
│   └── gateway-payment-modal.tsx   # 支付弹窗组件
├── app/[locale]/
│   ├── subscription/page.tsx       # 订阅页面 (已更新)
│   └── test-gateway-payment/page.tsx  # 测试页面
└── scripts/
    └── setup-payment-gateway.ts    # 配置脚本
```

## 核心功能说明

### 1. 支付流程

```
用户选择套餐 → 创建订单 → 展示二维码 → 用户扫码支付 → 
支付网关回调 → 验证签名 → 激活订阅 → 通知用户
```

### 2. 安全机制

- **签名验证**: 使用HMAC-SHA256验证回调数据完整性
- **时间戳验证**: 防止重放攻击 (5分钟有效期)
- **幂等性处理**: 防止重复处理同一订单

### 3. 错误处理

- 网络错误自动重试
- 订单创建失败提示
- 支付超时处理
- 签名验证失败保护

## 测试步骤

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev

# 访问测试页面
http://localhost:3000/zh-CN/test-gateway-payment
```

### 2. 生产测试

1. 确保环境变量已正确配置
2. 确保回调URL可以访问
3. 在订阅页面选择套餐进行支付测试

### 3. 回调测试

使用以下命令测试回调处理：

```bash
curl -X POST http://localhost:3000/api/payment/gateway-callback \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD1234567890",
    "amount": 0.01,
    "uid": "ORD1234567890",
    "paymentMethod": "alipay",
    "status": "success",
    "timestamp": "2025-01-13 19:26:15",
    "customerType": "新客户",
    "nonce": "f8e3d2c1b0a9",
    "signature": "your_calculated_signature"
  }'
```

## API接口文档

### 1. 创建支付订单

**POST** `/api/payment/gateway-order`

```json
{
  "planId": "plan_id",
  "paymentMethod": "alipay" | "wechat"
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "orderId": "local_order_id",
    "gatewayOrderId": "gateway_order_id",
    "amount": 0.01,
    "paymentMethod": "alipay",
    "expiresAt": "2025-01-13 19:40:38"
  }
}
```

### 2. 支付状态查询

**GET** `/api/payment/order-status/{orderId}`

```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "status": "pending" | "paid" | "failed",
    "amount": 0.01,
    "paymentMethod": "alipay",
    "createdAt": "2025-01-13 19:25:38",
    "paidAt": "2025-01-13 19:26:15"
  }
}
```

### 3. 支付回调处理

**POST** `/api/payment/gateway-callback`

自动处理支付网关回调，验证签名并激活用户订阅。

## 故障排除

### 1. 常见问题

**Q: 支付弹窗显示"创建订单失败"**
- 检查API密钥是否正确配置
- 确保用户已登录
- 查看服务器日志确认具体错误

**Q: 支付成功但订阅未激活**
- 检查回调URL是否可访问
- 验证签名计算是否正确
- 查看回调处理日志

**Q: 签名验证失败**
- 确认API密钥配置正确
- 检查参数排序和编码方式
- 对比文档中的签名算法

### 2. 调试技巧

```bash
# 查看支付相关日志
npm run dev 2>&1 | grep -i payment

# 测试回调URL连通性
curl -X GET https://你的域名.com/api/payment/gateway-callback

# 验证环境变量
echo $PAYMENT_GATEWAY_API_KEY
```

## 部署说明

### 1. 生产环境配置

```bash
# 设置生产环境变量
export PAYMENT_GATEWAY_URL=https://pay.chats2gpt.com
export PAYMENT_GATEWAY_API_KEY=生产环境API密钥
export PAYMENT_GATEWAY_CALLBACK_URL=https://生产域名.com/api/payment/gateway-callback
```

### 2. 域名和SSL

确保回调URL使用HTTPS协议，支付网关只接受安全连接。

### 3. 防火墙配置

确保服务器可以接收来自支付网关的回调请求。

## 监控和维护

### 1. 日志监控

关键日志位置：
- 订单创建：`创建支付网关订单API错误`
- 回调处理：`收到支付回调`
- 支付成功：`支付成功处理完成`

### 2. 性能监控

监控指标：
- 订单创建成功率
- 支付成功率  
- 回调处理时间
- 用户订阅激活率

### 3. 定期维护

- 定期检查过期订单
- 清理临时数据
- 备份支付记录
- 更新API密钥

## 技术支持

如需技术支持，请提供：
1. 详细错误日志
2. 复现步骤
3. 环境信息
4. 相关配置信息

---

**更新时间**: 2025年1月13日  
**版本**: v1.0.0