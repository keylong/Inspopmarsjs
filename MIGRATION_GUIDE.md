# MySQL 到 Supabase 数据迁移指南

## 概述

本指南将帮助您将现有的 MySQL 用户数据迁移到 Supabase，并集成 Supabase 认证系统。

## 前置准备

### 1. 配置环境变量

在 `.env.local` 文件中配置您的 MySQL 数据库连接信息：

```env
# MySQL 数据库连接（用于数据迁移）
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name
MYSQL_PORT=3306
```

### 2. 验证 Supabase 配置

确保以下 Supabase 环境变量已正确配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. 安装依赖

```bash
npm install
```

## 数据迁移步骤

### 第一步：备份现有数据

**⚠️ 重要：在开始迁移前，请务必备份您的 MySQL 数据库！**

```bash
mysqldump -u root -p your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 第二步：运行数据迁移

```bash
# 使用 tsx（推荐）
npm run migrate:mysql-dev

# 或者使用 ts-node
npm run migrate:mysql
```

### 第三步：验证迁移结果

迁移脚本会自动验证以下内容：
- 认证用户数量与业务用户数量是否一致
- 输出详细的成功/失败统计信息
- 显示任何迁移失败的用户及错误原因

## 数据映射说明

### MySQL 字段到 Supabase 的映射

| MySQL 字段 | Supabase Auth | Supabase users 表 | 说明 |
|------------|---------------|-------------------|------|
| id | - | - | 原始 MySQL ID（未保存，使用新的 UUID）|
| username | user_metadata.username | username | 用户名 |
| password | encrypted_password | - | 重新哈希为 bcrypt |
| email | email | email | 邮箱地址 |
| sex | - | sex | 性别 |
| phone | - | phone | 电话号码 |
| value | - | value | 用户积分/余额 |
| token | - | token | 自定义令牌 |
| buytype | - | buytype | 购买类型 |
| buydate | - | buydate | 购买日期 |
| downloading | - | downloading | 下载状态 |
| account | - | account | 账户类型 |

### 认证系统更新

迁移后，认证系统支持以下功能：

1. **双重登录**：用户可以使用用户名或邮箱登录
2. **统一密码**：所有密码使用 bcrypt 哈希
3. **完整用户资料**：登录后返回完整的用户业务数据
4. **新用户注册**：支持用户名唯一性验证

## API 接口变更

### 登录接口 (`/api/auth/login`)

**请求格式：**
```json
{
  "identifier": "username_or_email",
  "password": "user_password"
}
```

**响应格式：**
```json
{
  "message": "登录成功",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "name": "username",
    "value": 100,
    "buytype": 1,
    "buydate": "2024-01-01"
  },
  "session": { ... }
}
```

### 注册接口 (`/api/auth/register`)

**请求格式：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "unique_username",
  "sex": "male",
  "phone": "1234567890"
}
```

## 常见问题

### Q: 迁移失败怎么办？

A: 检查以下内容：
1. MySQL 连接配置是否正确
2. Supabase Service Role Key 是否有效
3. 查看迁移脚本输出的错误详情
4. 检查是否有重复的邮箱或用户名

### Q: 用户需要重新设置密码吗？

A: 不需要。脚本会自动处理密码哈希转换，用户可以使用原来的密码登录。

### Q: 原有的自定义 session 怎么处理？

A: 迁移后使用 Supabase JWT token 替代原有的 session 机制。原有的 session 字段会被保留在 `user_sessions` 表中。

### Q: 如何回滚迁移？

A: 目前需要手动回滚：
1. 删除 Supabase 中的所有用户数据
2. 从备份恢复 MySQL 数据
3. 重新配置应用使用 MySQL

## 迁移后的维护

1. **监控认证日志**：定期检查 Supabase 认证日志
2. **性能监控**：观察数据库查询性能
3. **用户反馈**：收集用户登录体验反馈

## 技术支持

如有问题，请检查：
1. 迁移脚本的输出日志
2. Supabase Dashboard 中的错误日志  
3. 应用的服务器日志

迁移过程中如遇到问题，可以随时停止并从备份恢复。