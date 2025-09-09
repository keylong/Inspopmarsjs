# Neon Auth 配置指南

## 第一步：在 Neon 控制台启用 Neon Auth

1. 访问 [Neon 控制台](https://console.neon.tech)
2. 选择你的项目
3. 在左侧菜单中找到 "Auth" 或 "Neon Auth" 选项
4. 点击 "Enable Neon Auth" 按钮
5. 系统会自动创建 `neon_auth` schema 和 `users_sync` 表

## 第二步：获取 Stack Auth 凭据

启用 Neon Auth 后，你会获得以下凭据：

- **Project ID**: 你的 Stack Auth 项目 ID
- **Publishable Key**: 客户端公开密钥
- **Secret Key**: 服务器端密钥

## 第三步：配置环境变量

将以下内容复制到 `.env.local` 文件：

```env
# Stack Auth / Neon Auth 配置
NEXT_PUBLIC_STACK_PROJECT_ID=你的项目ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=你的公开密钥
STACK_SECRET_SERVER_KEY=你的服务器密钥

# 保留现有的 Neon 数据库连接
DATABASE_URL=你的数据库连接字符串
DIRECT_URL=你的直连字符串
```

## 第四步：验证数据库表

运行以下 SQL 查询验证 Neon Auth 表已创建：

```sql
-- 查看 neon_auth schema
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'neon_auth';

-- 查看 users_sync 表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'neon_auth' 
AND table_name = 'users_sync';
```

## 第五步：测试连接

创建并运行测试文件来验证配置：

```bash
npm run dev
# 访问 http://localhost:3000/auth/signin
```

## 注意事项

1. **Beta 阶段**: Neon Auth 目前处于 Beta 阶段，可能会有变化
2. **数据同步**: 用户数据会自动同步到 `neon_auth.users_sync` 表
3. **向后兼容**: 现有的用户数据需要手动迁移

## 支持资源

- [Neon Auth 文档](https://neon.com/docs/neon-auth)
- [Stack Auth 文档](https://docs.stack-auth.com)
- [Discord 社区](https://discord.stack-auth.com)