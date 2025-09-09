import 'server-only'
import { StackServerApp } from '@stackframe/stack'

// 服务器端 Stack Auth 配置
export const stackApp = new StackServerApp({
  tokenStore: 'nextjs-cookie', // 使用 Next.js cookie 存储
})