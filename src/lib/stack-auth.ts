import 'server-only'
import { StackServerApp } from '@stackframe/stack'

// 服务器端 Stack Auth 配置
// 不需要指定 tokenStore，Stack Auth 会自动处理
export const stackApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
})