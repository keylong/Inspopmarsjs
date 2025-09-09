import { stackServerApp } from '@stackframe/stack'

// 服务器端 Stack Auth 配置
export const stackApp = stackServerApp({
  // 这些值从环境变量读取
  // 不需要显式传递，Stack SDK 会自动读取
})

// 导出常用功能
export const { 
  getUser,
  withAuth,
  withSession,
} = stackApp