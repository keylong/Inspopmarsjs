# Stack Auth (Neon Auth) 集成文档

## 集成概述

本项目已集成 Stack Auth（Neon Auth 的底层技术），替代了原有的 NextAuth.js 认证系统。

## 已完成的工作

### 1. 核心配置文件

#### `/src/lib/stack.ts`
```typescript
import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/sign-in",
    signUp: "/handler/sign-up",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/",
  },
});
```

#### `/src/components/providers/stack-provider.tsx`
```typescript
import { StackProvider, StackTheme } from '@stackframe/stack'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactNode } from 'react'
import { stackServerApp } from '@/lib/stack'

export function StackAuthProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <StackProvider app={stackServerApp}>
        <StackTheme>
          {children}
        </StackTheme>
      </StackProvider>
    </TooltipProvider>
  )
}
```

### 2. 认证钩子

#### `/src/hooks/useAuth.ts`
提供两种认证钩子：
- `useAuth()`: 需要强制登录的页面使用
- `useOptionalAuth()`: 不需要强制登录的页面使用

### 3. 路由处理器

创建了以下路由处理器：
- `/src/app/handler/sign-in/route.ts` - 登录 API 路由
- `/src/app/handler/sign-in/page.tsx` - 登录 UI 页面
- `/src/app/handler/sign-up/route.ts` - 注册 API 路由
- `/src/app/handler/sign-up/page.tsx` - 注册 UI 页面
- `/src/app/handler/[...stack]/page.tsx` - 通用 Stack Auth 处理器
- `/src/app/api/auth/[...stack]/route.ts` - API 路由处理器

### 4. 认证页面

- `/src/app/[locale]/auth/signin/page.tsx` - 重定向到 Stack Auth 登录
- `/src/app/[locale]/auth/signup/page.tsx` - 重定向到 Stack Auth 注册

### 5. 测试页面

- `/src/app/test-auth/page.tsx` - 用于测试 Stack Auth 集成的页面

## 环境变量配置

在 `.env.local` 中配置：
```env
NEXT_PUBLIC_STACK_PROJECT_ID='393dcf36-f89e-4b3a-a5ee-38e62e95e98c'
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY='pck_tem719fr2ga33f94651cfdwkmxm3pjpeq6s95hhaewxh0'
STACK_SECRET_SERVER_KEY='ssk_mtwyc2xqzj1dd31kf5phqg9ze1k42m6yv411yrj925q00'
```

## 使用方法

### 1. 在组件中检查认证状态

```typescript
import { useOptionalAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useOptionalAuth();
  
  if (isAuthenticated) {
    return <div>欢迎，{user?.name}!</div>;
  }
  
  return <div>请登录</div>;
}
```

### 2. 保护路由

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>这是受保护的内容</div>
    </ProtectedRoute>
  );
}
```

### 3. 登录/注册链接

```typescript
<Link href="/auth/signin">登录</Link>
<Link href="/auth/signup">注册</Link>
```

## 已知问题和注意事项

1. **Stack Auth 初始化错误**: 如果遇到 `Symbol(StackAuth--DO-NOT-USE-OR-YOU-WILL-BE-FIRED--StackAppInternals)` 错误，通常是因为 Stack Auth 实例被多次创建。确保只在 `/src/lib/stack.ts` 中创建一次。

2. **Cookie 存储**: Stack Auth 使用 cookie 存储认证令牌，确保配置正确。

3. **Provider 层级**: 确保 `StackAuthProvider` 包裹整个应用，并且在其他需要认证的 Provider 之前。

## 测试步骤

1. 访问 `/test-auth` 页面检查集成状态
2. 点击登录链接，应该重定向到 `/handler/sign-in`
3. 完成登录后，应该重定向回首页
4. 在导航栏中应该显示用户信息

## 下一步工作

1. 完善错误处理和用户反馈
2. 添加更多认证功能（如密码重置、邮箱验证等）
3. 优化 UI/UX 体验
4. 添加社交登录支持（如 Google、GitHub 等）

## 参考资源

- [Stack Auth 官方文档](https://docs.stack-auth.com)
- [Neon Auth 文档](https://neon.com/docs/neon-auth)
- [Next.js App Router 文档](https://nextjs.org/docs/app)