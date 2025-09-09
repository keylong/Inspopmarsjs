'use client'

import { StackProvider, StackTheme } from '@stackframe/stack'
import { ReactNode } from 'react'

// Stack Auth 主题配置
const stackTheme: StackTheme = {
  colors: {
    primaryColor: '#3b82f6', // 蓝色主题
    neutralColor: '#6b7280',
    errorColor: '#ef4444',
    successColor: '#10b981',
  },
}

interface StackAuthProviderProps {
  children: ReactNode
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
  return (
    <StackProvider
      app={{
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
        publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
      }}
      theme={stackTheme}
    >
      {children}
    </StackProvider>
  )
}