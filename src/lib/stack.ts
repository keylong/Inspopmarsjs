import "server-only";
import { StackServerApp } from "@stackframe/stack";

// 服务器端 Stack 实例
// 这个实例用于服务器组件和 API 路由
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie", // 使用 cookie 存储 token
  urls: {
    home: "/zh-CN",
    signIn: "/zh-CN/signin",
    signUp: "/zh-CN/signup",
    afterSignIn: "/zh-CN",
    afterSignUp: "/zh-CN",
    afterSignOut: "/zh-CN",
    // Stack Auth 内部回调处理
    handler: "/auth",
  },
});