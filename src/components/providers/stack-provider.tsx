'use client'

import { StackProvider } from '@stackframe/stack'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactNode, useEffect, useState } from 'react'

interface StackAuthProviderProps {
  children: ReactNode
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
  const [stackApp, setStackApp] = useState<any>(null)

  useEffect(() => {
    // 动态导入 StackClientApp 以避免服务器端问题
    const initStackApp = async () => {
      try {
        const { StackClientApp } = await import('@stackframe/stack')
        const app = new StackClientApp()
        setStackApp(app)
      } catch (error) {
        console.error('Failed to initialize Stack Auth:', error)
      }
    }

    initStackApp()
  }, [])

  // 在客户端加载 Stack Auth 之前，只渲染 TooltipProvider
  if (!stackApp) {
    return (
      <TooltipProvider>
        {children}
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <StackProvider app={stackApp}>
        {children}
      </StackProvider>
    </TooltipProvider>
  )
}