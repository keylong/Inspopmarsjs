'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactNode } from 'react'

// 创建 Stack Client App 实例
const stackApp = new StackClientApp({
  tokenStore: 'cookie', // 使用 cookie 存储 token
})

interface StackAuthProviderProps {
  children: ReactNode
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
  return (
    <TooltipProvider>
      <StackProvider app={stackApp}>
        {children}
      </StackProvider>
    </TooltipProvider>
  )
}