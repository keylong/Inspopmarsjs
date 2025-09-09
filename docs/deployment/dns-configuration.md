# DNS 配置和 SSL 证书设置指南

## 概述

本指南详细说明了如何为 Instagram 下载器项目配置 DNS 记录和 SSL 证书，确保域名 `ins.popmars.com` 正确指向 Vercel 部署。

## DNS 配置步骤

### 1. 主域名配置

在您的 DNS 管理面板中，添加以下记录：

```dns
# 主域名 A 记录
Type: A
Name: ins.popmars.com
Value: 76.76.19.101
TTL: 300

# 或者使用 CNAME（推荐）
Type: CNAME
Name: ins.popmars.com
Value: cname.vercel-dns.com
TTL: 300
```

### 2. WWW 子域名配置

```dns
# WWW 重定向
Type: CNAME
Name: www.ins.popmars.com
Value: cname.vercel-dns.com
TTL: 300
```

### 3. 邮件相关记录（可选）

```dns
# MX 记录（如果需要邮件服务）
Type: MX
Name: ins.popmars.com
Value: 10 mail.ins.popmars.com
TTL: 3600

# SPF 记录
Type: TXT
Name: ins.popmars.com
Value: "v=spf1 include:_spf.google.com ~all"
TTL: 3600
```

## Vercel 域名配置

### 1. 添加域名到 Vercel 项目

```bash
# 使用 Vercel CLI 添加域名
vercel domains add ins.popmars.com
vercel domains add www.ins.popmars.com

# 或在 Vercel Dashboard 中配置
# 1. 进入项目设置
# 2. 点击 "Domains" 选项卡
# 3. 添加 ins.popmars.com
# 4. 添加 www.ins.popmars.com（配置为重定向到主域名）
```

### 2. 验证域名所有权

Vercel 会要求验证域名所有权：

```dns
# TXT 验证记录（Vercel 会提供具体值）
Type: TXT
Name: _vercel
Value: vc-domain-verify=ins.popmars.com,12345678...
TTL: 300
```

## SSL 证书配置

### 1. 自动 SSL 证书

Vercel 会自动为配置的域名颁发 Let's Encrypt SSL 证书：

- 证书会在域名验证成功后自动颁发
- 支持通配符证书
- 自动续期，无需手动维护

### 2. 证书状态检查

```bash
# 检查证书状态
vercel certs ls

# 强制更新证书
vercel certs renew ins.popmars.com
```

### 3. HTTPS 重定向

在 `vercel.json` 中配置 HTTPS 重定向（已配置）：

```json
{
  "redirects": [
    {
      "source": "http://ins.popmars.com/(.*)",
      "destination": "https://ins.popmars.com/$1",
      "permanent": true
    }
  ]
}
```

## 安全增强配置

### 1. HSTS 头设置

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### 2. CAA 记录（证书颁发机构授权）

```dns
# CAA 记录限制证书颁发机构
Type: CAA
Name: ins.popmars.com
Value: 0 issue "letsencrypt.org"
TTL: 3600

Type: CAA
Name: ins.popmars.com
Value: 0 issuewild "letsencrypt.org"
TTL: 3600
```

## 性能优化配置

### 1. CDN 配置

```dns
# 如果使用额外的 CDN
Type: CNAME
Name: cdn.ins.popmars.com
Value: your-cdn-provider.com
TTL: 3600
```

### 2. TTL 优化策略

```dns
# 生产环境 TTL 设置
A 记录: 300 秒 (5分钟)
CNAME 记录: 300 秒 (5分钟)
TXT 记录: 3600 秒 (1小时)
MX 记录: 3600 秒 (1小时)
```

## 灰度发布 DNS 策略

### 1. 基于权重的路由

```bash
# 使用 DNS 权重进行灰度发布
# 90% 流量到生产环境
# 10% 流量到金丝雀环境

# 主要生产环境
Type: A
Name: ins.popmars.com
Value: 76.76.19.101
Weight: 90

# 金丝雀环境
Type: A
Name: ins.popmars.com
Value: 76.76.19.102
Weight: 10
```

### 2. 子域名策略

```dns
# 金丝雀子域名
Type: CNAME
Name: canary.ins.popmars.com
Value: preview-deployment.vercel.app
TTL: 60

# 测试子域名
Type: CNAME
Name: staging.ins.popmars.com
Value: staging-deployment.vercel.app
TTL: 60
```

## 监控和健康检查

### 1. DNS 监控

```bash
# 定期检查 DNS 解析
dig ins.popmars.com
nslookup ins.popmars.com

# 检查全球 DNS 传播
curl "https://www.whatsmydns.net/api/details?server=world&type=A&query=ins.popmars.com"
```

### 2. SSL 证书监控

```bash
# 检查 SSL 证书
openssl s_client -connect ins.popmars.com:443 -servername ins.popmars.com

# 检查证书过期时间
curl -vI https://ins.popmars.com 2>&1 | grep -i expire
```

## 故障排除

### 1. 常见问题

**DNS 传播延迟**
```bash
# 检查 DNS 传播状态
dig +trace ins.popmars.com
```

**SSL 证书问题**
```bash
# 验证证书链
openssl s_client -connect ins.popmars.com:443 -showcerts
```

**Vercel 域名配置问题**
```bash
# 检查 Vercel 域名状态
vercel domains ls
vercel domains inspect ins.popmars.com
```

### 2. 回滚策略

如果出现 DNS 问题，可以快速回滚：

```dns
# 紧急回滚到原 IP
Type: A
Name: ins.popmars.com
Value: [原始服务器IP]
TTL: 60  # 使用最短 TTL 快速生效
```

## 自动化脚本

创建自动化检查脚本：

```bash
#!/bin/bash
# dns-health-check.sh

echo "检查 DNS 解析..."
dig +short ins.popmars.com

echo "检查 HTTPS 状态..."
curl -I https://ins.popmars.com

echo "检查 SSL 证书..."
openssl s_client -connect ins.popmars.com:443 -servername ins.popmars.com < /dev/null 2>&1 | grep "Verify return code"
```

## 注意事项

1. **TTL 设置**: 部署期间使用较短的 TTL (60-300秒) 以便快速切换
2. **证书验证**: 确保所有子域名都包含在 SSL 证书中
3. **缓存清理**: DNS 更改后可能需要清理本地 DNS 缓存
4. **监控告警**: 设置 DNS 和 SSL 证书到期监控
5. **备份计划**: 保留原始 DNS 配置以备回滚使用

## 完成检查清单

- [ ] DNS A/CNAME 记录配置完成
- [ ] WWW 重定向设置完成
- [ ] Vercel 域名添加和验证完成
- [ ] SSL 证书自动颁发成功
- [ ] HTTPS 重定向配置完成
- [ ] 安全头设置完成
- [ ] DNS 传播验证完成
- [ ] 性能测试完成
- [ ] 监控告警设置完成